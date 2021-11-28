const { parentPort, workerData } = require('worker_threads')
const fs = require('fs');
const readline = require('readline');


const {path} = workerData

const response = []
    var lineReader = readline.createInterface({
      input: fs.createReadStream(path)
    });
    lineReader.on('line', async (line) => {
            let table = line.split(",")
            var doc = { 
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
          //response.push(doc);
          
    })
    lineReader.on('close', function() {
      //parentPort.postMessage(response)
    });
