
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const doSomething = (_tab, i) => {        
    return new Promise(()=>{
        let index = _tab.val.findIndex(element => element == true)
        _tab.val[index]=false
        console.log("debut de process "+ i)

    setTimeout(()=>{
        console.log("fin de process "+ i)
        _tab.val[index]=true
        resolve()
    }, Math.floor(Math.random() * 10000)+1000)
})
}

const checker = (tab) => {
    return new Promise(async (resolve) => {
        while (!tab.val.includes(true)){
           await sleep(1)
        }
        resolve()
    })
}

const func1  = async () => {
    const tab  = {val: [true, true, true, true]}
    

    for(let i=0; i < 6; i++){
        doSomething(tab, i)
        await checker(tab)
    }
}


func1()