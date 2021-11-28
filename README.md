# Siren invader

Siren invader allows the division and indexing of a typed CSV file (educational project)

## Installation

Use npm 

Use the package manager [npm](https://www.npmjs.com/) to install Siren invader.

```bash
npm install
```

## Usage

```bash
node divider.js

node indexation.js
```

## Functions

### divider.js

#### readBytes() 
fs.read function return promise

#### readBytesAndCreateFile()
fs.read function return promise and create file at the end

#### generateChunks()
Function who calculate all starts pointsin the file 
Theb start in asyncronous way, all the dividers processus

### indexation.js

#### executeWorker()
Create worker

### shared functions

#### sleep()
return Promise after waiting 

#### checker()
check if their is free slots avaible or if the program is paused

### workers

#### worker.js : 
Send to main thread every line with readline

#### workerWithBuffer.js : 
Send to main thread every line with fs.read and calculated inside the buffer

## License
[MIT](https://choosealicense.com/licenses/mit/)