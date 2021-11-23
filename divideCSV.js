const fs = require('fs');

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

module.exports = divide;