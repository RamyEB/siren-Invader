const fs = require('fs');

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

async function readBytesAndCreateFile(fd, start, sizeBytes, arrayOfBuffer, slots, i, size, last, index) {
    arrayOfBuffer[index]
    //console.log("process start :" + i)
    return new Promise( async (resolve, reject) => {
        fs.read(
            fd, 
            arrayOfBuffer[index],
            0,
            sizeBytes,
            start,
            (err) => {
                if(err) { return reject(err); }
                if(last){
                    sizeBytes = size - start;
                    fs.writeFileSync(`./files/Lbl-CSV-GEN-${i+1}.csv`, `${arrayOfBuffer[index].slice(0, sizeBytes)}`)
        
                }else{
                    fs.writeFileSync(`./files/Lbl-CSV-GEN-${i+1}.csv`, `${arrayOfBuffer[index].slice(0, arrayOfBuffer[index].lastIndexOf('\n'))}`)
                }
                slots[index]=true
                //console.log("process fin :" + i)
                resolve();
            }
        );
    });
}


async function generateChunks(filePath, size, processus) {
    const sharedBuffer = Buffer.alloc(size);
    const stats = fs.statSync(filePath);


    const arrayOfBuffer = []
    for(let i = 0; i<processus; i++){
        arrayOfBuffer[i]= Buffer.alloc(size);
    }

    const slots = []
    for(let i = 0; i<processus; i++){
        slots[i]=true
    }


    const fd = fs.openSync(filePath);
    let sizeBytes = sharedBuffer.length;

    let tableIndexOfStarts = []

    tableIndexOfStarts[0]=0
    for(let i = 1; tableIndexOfStarts[i-1]+sizeBytes <= stats.size; i++){
        await readBytes(fd, tableIndexOfStarts[i-1], sizeBytes, sharedBuffer);
        tableIndexOfStarts[i] = tableIndexOfStarts[i-1] + sharedBuffer.lastIndexOf('\n') +1
    }

    for(let i = 0; i < tableIndexOfStarts.length; i++){
        //Read $fd from $start to $start + $sizeBytes (end) put data into $sharedBuffer

        // percentage 
        process.stdout.write(`${Number.parseFloat(tableIndexOfStarts[i]*100/stats.size).toPrecision(3)}%\r`)

        index = slots.findIndex(element => element == true)
        slots[index]=false
        if(i+1 >= tableIndexOfStarts.length)
        readBytesAndCreateFile(fd, tableIndexOfStarts[i], sizeBytes, arrayOfBuffer, slots, i, stats.size, true, index);
        else
        readBytesAndCreateFile(fd, tableIndexOfStarts[i], sizeBytes, arrayOfBuffer, slots, i, stats.size, false, index);
        await checker(slots);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

const checker = (tab) => {
    return new Promise(async (resolve) => {
        while (!tab.includes(true)){
           await sleep(1)
           //console.log("\rattente")
        }
        resolve()
    })
}

const main = async () => {

    /*
    DIVIDE FILE
    */

    //Delete and create ./file repertory
    fs.rmSync('./files',{ recursive: true })
    fs.mkdirSync("./files", ()=>{})

    //Timing counter
    console.time("Total program")

    const filePath = './StockEtablissement_utf8.csv'
    const stats = fs.statSync(filePath);

    //Buffer size (not nb files)
    let size = Math.ceil(stats.size/600);

    const processus = 10;

    //division du fichier
    await generateChunks(filePath, size, processus).then(()=>{
        console.timeEnd("Total program")
    })

}

main()
