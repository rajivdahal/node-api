var events=require('events')
const myevents=new events.EventEmitter()
const myevent=new events.EventEmitter()


setTimeout(function(){
    myevent.emit('kishor','hello')
},3000)

myevents.on('kishor',function(data){
    console.log("data in kishor event is",data)
})