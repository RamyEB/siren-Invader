const { MongoClient } = require('mongodb');
const {divide, divideLineByLine, divideLineByLineWithCount} = require("./divideCSV")

//console.time('ET | Divide CSV')
//divide("./sirenExample.csv", 20000)
//console.timeEnd('ET | Divide CSV')

divideLineByLineWithCount("./sirenExample.csv", 1000)
