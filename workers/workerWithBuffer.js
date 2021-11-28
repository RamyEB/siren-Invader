const { parentPort, workerData } = require('worker_threads')
const fs = require('fs');

const {path} = workerData

function readBytes(fd, start, sizeBytes, buff) {
    return new Promise((resolve, reject) => {
        fs.read(
            fd, 
            buff,
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

const fd = fs.openSync(path);
const stats = fs.statSync(path);
let buff = Buffer.alloc(stats.size) 
let table = []
var doc = {}

readBytes(fd, 0, stats.size, buff).then(()=>{
    let lastElementIndex = 0
    
    for(let i = 0; buff.indexOf("\n", lastElementIndex+1) != -1; i++){
    if(i==0){
        table = buff.slice(0,  buff.indexOf("\n", lastElementIndex+1)).toString().split(",")
    }
    else{
        table = buff.slice(lastElementIndex+1,buff.indexOf("\n", lastElementIndex+1)).toString().split(",")
    }
        doc = { 
            siren: table[0], 
            nic: table[1], 
            siret : table[2],
            dateCreationEtablissement: table[4], 
            dateDernierTraitementEtablissement: table[8], 
            typeVoieEtablissement: table[14], 
            libelleVoieEtablissement: table[15], 
            codePostalEtablissement: table[16], 
            libelleCommuneEtablissement: table[17], 
            codeCommuneEtablissement: table[20], 
            dateDebut: table[39], 
            etatAdministratifEtablissement: table[40]
        }
        parentPort.postMessage(doc)
    lastElementIndex = buff.indexOf("\n", lastElementIndex+1);

    }
    if(buff.indexOf("\n", lastElementIndex+1) == -1){
        table = buff.slice(lastElementIndex+1, buff.at(-1)).toString()
        doc = { 
            siren: table[0], 
            nic: table[1], 
            siret : table[2],
            dateCreationEtablissement: table[4], 
            dateDernierTraitementEtablissement: table[8], 
            typeVoieEtablissement: table[14], 
            libelleVoieEtablissement: table[15], 
            codePostalEtablissement: table[16], 
            libelleCommuneEtablissement: table[17], 
            codeCommuneEtablissement: table[20], 
            dateDebut: table[39], 
            etatAdministratifEtablissement: table[40]
        }
        parentPort.postMessage(doc)
    }
});