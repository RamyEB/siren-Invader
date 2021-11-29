const { ConnectionDB } = require('./mongo');
const fs = require('fs');
const {Worker} = require('worker_threads');
const { resolve } = require('path');
const { emitKeypressEvents } = require("readline");

let paused = false

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

if (process.stdin.isTTY) {
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on("keypress", (str, key) => {
      if (key.ctrl) {
        if (key.name === "p") {
            paused = true
          console.log("\nPause...");
        } else if (key.name === "r") {
            paused = false
          console.log("\Resume...");
        } else if (key.name === "c") {
            process.exit()
      }
    }       
    });
  }
  

const checker = (tab) => {
    return new Promise(async (resolve) => {
        while (!tab.tab.includes(true) || paused){
           await sleep(1)
        }
        resolve()
    })
}


async function executeWorker(file, path, id, val, connection) {
    index = val.tab.findIndex(element => element == true)
    val.tab[index]=false
    var bulk = connection.bulk();  

    return new Promise(()=>{
        const worker = new Worker(file, {
            workerData: {
                path, 
            }});

        // Une fois le worker actif
        worker.on('online', () => { 
            //console.log("Début de worker : "+ id)
            //console.time("Fin de worker : "+ id)
        })

        // Si error est reçu du worker
        worker.on("error", (e)=>{
            console.log("error on " + id +" : " + e)
        })

        //Reçu du worker
        worker.on('message', workerMessage => {
            bulk.insert(workerMessage)
        })

        //Fin du worker
        worker.on('exit', ()=>{
            bulk.execute()
            //console.timeEnd("Fin de worker : "+ id)
            val.tab[index]=true
            resolve()
        })
    })
}

const main = async () => {
    const processus = 10
    const numberfiles = fs.readdirSync('./files/').length
    const connection  = new ConnectionDB()
    await connection.run()

    const val  =  {tab: []}
    for(let i = 0; i<processus; i++){
        val.tab[i]=true
    }

    console.time("Programme : ")
    await new Promise( async (resolve)=>{
        for(let i=0; i < numberfiles; i++){
            process.stdout.write(`\r${Number.parseFloat(i*100/numberfiles).toPrecision(3)}%`)
            executeWorker('./workers/workerWithBuffer.js', `./files/Lbl-CSV-GEN-${i+1}.csv`, i, val, connection)
            await checker(val)
        }
        resolve()
    }).then(()=>{
        process.stdout.write(`\r100%`)
        console.timeEnd("Programme : ")
    })
    //connection.close()
}

main()