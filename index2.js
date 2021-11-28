const { ConnectionDB } = require('./mongo');
const fs = require('fs');

const {divideFile, countNbLines} = require("./divideCSV");

const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');
const { resolve } = require('path');
const { reject } = require('lodash');

var workers = []

  
async function main(_fileName){
        //await divideFile(_fileName, 50000, await countNbLines(_fileName))


        const connection  = new ConnectionDB()
        const length = fs.readdirSync('./files/').length
        let i=1
        while (i <= 20){
            if (workers.filter(x => x==true).length<15){
                await executeWorker("./worker.js", `./files/Lbl-CSV-GEN-${i}.csv`, i, connection)
                .then(()=>{
                    workers.push(true)
                })
                i++

            }
        }
}

function executeWorker (file, path, numWorker, connection) {
    const worker = new Worker(file, {
        workerData: {
            fileName: path, 
            id: numWorker 
        }});

    // Une fois le worker actif
    worker.on('online', () => { 
      console.log('Lancement du worker :' + numWorker) 
      console.time('Fin Worker : ' + numWorker)
      console.log(workers.filter(x => x==true).length)
    })

    // Si un message est reçu du worker
    worker.on("error", (e)=>{
        console.log("error on " + numWorker +" : " + e)
    })

    worker.on('message', workerMessage => {
        connection.insertManyIntoDb(workerMessage).then(() => {
            console.log("data from "+ numWorker +" posted ")
        })
    })


    worker.on('exit', ()=>{
        workers[workers.findIndex(element => element == true)] = false
        console.timeEnd('Fin Worker : ' + numWorker)
        console.log(workers.filter(x => x==true).length)
    })
}

//main('./StockEtablissement_utf8.csv')

/*
function readBytes(fd, sharedBuffer) {
    return new Promise((resolve, reject) => {
        fs.read(
            fd, 
            sharedBuffer,
            0,
            sharedBuffer.length,  
            null,
            (err) => {
                if(err) { return reject(err); }
                resolve();
            }
        );
    });
}

    async function* generateChunks(filePath, size) {
        const sharedBuffer = Buffer.alloc(size);
        const stats = fs.statSync(filePath); // file details
        const fd = fs.openSync(filePath); // file descriptor
        let bytesRead = 0; // how many bytes were read
        let end = size;

        for(let i = 0; i < Math.ceil(stats.size / size); i++) {
            await readBytes(fd, sharedBuffer);
            bytesRead = (i + 1) * size; 
            if(bytesRead > stats.size) {
               // When we reach the end of file, 
               // we have to calculate how many bytes were actually read
            } 
            yield sharedBuffer.slice(0, end);
        }
    }

    function readBytesStream(filePath, _start, size, i) {
        return new Promise((resolve) => {
            console.log(i)
            let res = Buffer.alloc(size-_start)
            const fd_2 = fs.createReadStream(filePath, {start: _start, end: size})
            fd_2.on('data', (chunk) => {
                res+= chunk
            });

            fd_2.on('close',(chunk) =>{
                resolve(res);
            })
        });
    }
    

    async function* generateChunksStream(filePath, size) {
        const stats = fs.statSync(filePath); // file details
        let bytesRead = 0; // how many bytes were read
        const buffer = Buffer.alloc(size)

        for(let i = 0; i < Math.ceil(stats.size / size); i++) {
            var resp = readBytesStream(filePath,bytesRead, bytesRead+size-1, i, buffer)
            bytesRead = (i + 1) * size;
            if(bytesRead > stats.size) {
                
               // When we reach the end of file, 
               // we have to calculate how many bytes were actually read
            } 

            yield resp
        }
    }*/


    function readBytes(fd, start, sizeBytes, sharedBuffer) {
        return new Promise((resolve, reject) => {
            fs.read(
                fd, 
                sharedBuffer,
                0,
                sizeBytes,
                start,
                (err) => {
                    if(err) { return reject(err); }
                    resolve();
                }
            );
        });
    }

    async function generateChunks(filePath, size) {
        const sharedBuffer = Buffer.alloc(size);
        const stats = fs.statSync(filePath); // file details
        const fd = fs.openSync(filePath); // file descriptor

        let start = 0;
        let sizeBytes = sharedBuffer.length;


        for(let i = 0; start < stats.size-1; i++){
            //process.stdout.write(`${Number.parseFloat(start*100/stats.size).toPrecision(3)}%\r`)
            await readBytes(fd, start, sizeBytes, sharedBuffer);
            start+= sharedBuffer.lastIndexOf('\n') + 1;


            fileRef =  `./files/Lbl-CSV-GEN-${i+1}.csv`
            fs.writeFile(`${fileRef}`, `${sharedBuffer.slice(0, sharedBuffer.lastIndexOf('\n'))}`, ()=>{})

            if ( stats.size < start+sizeBytes){
                sizeBytes = stats.size - start;
                await readBytes(fd, start, sizeBytes, sharedBuffer);
                fileRef =  `./files/Lbl-CSV-GEN-${i+2}.csv`
                fs.writeFile(`${fileRef}`, `${sharedBuffer.slice(0, sizeBytes)}`, ()=>{})
                break;
            }
           
        }
    }
    

const test = async ()=> {

    fs.rmSync('./files',{ recursive: true })
    fs.mkdirSync("./files", ()=>{})


    console.time("Total program")
    const filePath = './nb.csv'
    const stats = fs.statSync(filePath);
    let size = Math.ceil(stats.size/100);
    let bytesRead = 0;  
    let i = 0
    await generateChunks(filePath, size).then(()=>{
        console.timeEnd("Total program")
    })
    setInterval(function () {
        console.log("je fais un truc")
    }, 1000);
}

//test()
//console.log(fs.statSync("./StockEtablissement_utf8.csv").size)


/*

const doSomething = (_tab, i) => {        
    return new Promise(()=>{
        let index = _tab.findIndex(element => element == true)
        _tab[index]=false
        console.log("debut de process "+ i)

    setTimeout(()=>{
        console.log("fin de process "+ i)
        _tab[index]=true
        resolve()
    }, Math.floor(Math.random() * 10000)+1000)
})
} */

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

const checker = (tab) => {
    return new Promise(async (resolve) => {
        while (!tab.tab.includes(true)){
           await sleep(1)
        }
        resolve()
    })
}

const func1  = async () => {
    const val  =  {tab: []}
    for(let i = 0; i<10; i++){
        val.tab[i]=true
    }
    const numberfiles = fs.readdirSync('./files/').length
    const connection  = new ConnectionDB()
    await connection.run()
    var bulk = connection.bulk();  



    console.time("Programme : ")
    await new Promise( async (resolve)=>{
        for(let i=0; i < numberfiles; i++){
            process.stdout.write(`\r${Number.parseFloat(i*100/numberfiles).toPrecision(3)}%`)
            executeWorkerTest('./workertest.js', `./files/Lbl-CSV-GEN-${i+1}.csv`, i, val, bulk, connection)
            await checker(val)
        }
        resolve()
    }).then(()=>{
        process.stdout.write(`\r100%`)
        try{
            bulk.execute();

        }catch{
            console.log("error")
        }
        console.timeEnd("Programme : ")
    })
    //connection.close()

}


func1()

async function  executeWorkerTest(file, path, id, val, bulk, connection) {
    index = val.tab.findIndex(element => element == true)
    val.tab[index]=false
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

        // Si e est reçu du worker
        worker.on("error", (e)=>{
            console.log("error on " + id +" : " + e)
        })

        //Reçu du worker
        worker.on('message', workerMessage => {
            //connection.insertManyIntoDb(workerMessage).then(() => {
                //console.log("data from "+ id +" posted ")
            //})
            bulk.insert(workerMessage)

        })

        //Fin du worker
        worker.on('exit', ()=>{
            //console.timeEnd("Fin de worker : "+ id)
            val.tab[index]=true
            resolve()
            if(id == 1){
            }
        })
    })
}