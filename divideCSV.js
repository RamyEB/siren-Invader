const fs = require('fs');
const readline = require('readline');


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

const divideLineByLineWithCount = (_fileName, _nbLineMaxByFile, _func) => {
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
    divideLineByLine(_fileName, _nbLineMaxByFile, _func, NbLine)
    });      
 
}

const divideLineByLine = (_fileName, _nbLineMaxByFile, _func, _NbLine) =>{
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
}


module.exports = {divide, divideLineByLine, divideLineByLineWithCount};