const fs = require('fs');
const { reject } = require('lodash');
const { resolve } = require('path');
const readline = require('readline');
const {ConnectionDB} = require("./mongo")



const divide = (_fileName, _nbLineMaxByFile) => {
    const data = fs.readFileSync(_fileName, 'utf8'); 
    const dataArray = data.split(/\r?\n/);

    let fileRef;
    let actualNbLine = 0;
    let nbFile = 0
    dataArray.map((line, index)=>{
      if(index == 0 || actualNbLine == _nbLineMaxByFile){
        actualNbLine = 0
        nbFile++
        fileRef =  `./files/CSV-GEN-${nbFile}.csv`
        fs.openSync(fileRef, "w")
      }
        fs.appendFileSync(`${fileRef}`, `${line}\n`)
        actualNbLine++
    })
}

const countNbLines = (_fileName) => {
  return new Promise((resolve, reject)=> {

  console.time('ET | Calc nb lines')

  var lineReaderCount = require('readline').createInterface({
    input: fs.createReadStream(_fileName)
  });

  let NbLine = 0;

  lineReaderCount.on('line', () => {
    
    NbLine++;
    })

  lineReaderCount.on('close', function() {
    console.timeEnd('ET | Calc nb lines')
    resolve(NbLine); 

    });
  })
}

const divideFile = async (_fileName, _nbLineMaxByFile, _NbLine) =>{
  return new Promise(()=> {
    console.time('ET | Line By Line')

    var lineReader = require('readline').createInterface({
      input: fs.createReadStream(_fileName)
    });
      
    let fileRef;
    let actualNbLine = 0;
    let nbFile = 0
    let nbLinesProcessed = 0
    lineReader.on('line', function (line) {
      nbLinesProcessed++;
      if(actualNbLine == 0 || actualNbLine == _nbLineMaxByFile){
        _NbLine && process.stdout.write(`${Number.parseFloat(nbLinesProcessed*100/_NbLine).toPrecision(3)}%\r`)
        actualNbLine = 0
        nbFile++
        fileRef =  `./files/Lbl-CSV-GEN-${nbFile}.csv`
        fs.openSync(fileRef, "w")
      }
        fs.appendFileSync(`${fileRef}`, `${line}\n`)
        actualNbLine++
    })
    lineReader.on('close', function() {
      console.timeEnd('ET | Line By Line')
    });

})
}



module.exports = {divideFile, countNbLines};