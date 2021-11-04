const config=require('./configs/index')
const socket=require('socket.io')

module.exports=function(app){
    const io = socket(app.listen(config.SOCKET_PORT), {
        cors: {
            allow: '*'
        }
    })
    io.on('connection', function (client) {
        console.log('client connected to socket server', client.id);

        client.emit('hello', 'hi from server')

        client.on('hi', function (data) {
            console.log('at hi event', data)
        })
    })

}