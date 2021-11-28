const { MongoClient } = require('mongodb');

class ConnectionDB {
   constructor(){
      this.url = 'mongodb://localhost:27017';
      this.client = new MongoClient(this.url);
      this.dbName = 'sirene';
      this.collection = 'etablissements';
      this.db = this.client.db(this.dbName),
      this.version = Math.floor(Math.random()*4000);
    }


  bulk() {
    return this.db.collection(this.collection).initializeUnorderedBulkOp();
    //this.db.collection(this.collection).bulkWrite({insertone : obj})
  }

  run() {
    return this.client.connect()
  }

  close = () => {
    this.client.close()
    .then(()=>{
      console.log("Connection closed !");
    })
    .catch(()=>{
      console.log("Connection can't close !");
    })
  }
  
}

module.exports = {ConnectionDB}