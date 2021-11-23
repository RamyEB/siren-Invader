const { MongoClient } = require('mongodb');
const divide = require("./divideCSV")

console.time('ET | Divide CSV')
divide("./sirenExample.csv", 13)
console.timeEnd('ET | Divide CSV')