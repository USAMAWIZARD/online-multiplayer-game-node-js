
var peer = new SimplePeer({
    initiator: init,
    trickle: false,
  })
  peer.on('signal', function (data) {
    console.log(data)
    socket.emit('peerid', [data,hissokid])

  })
  socket.on("reciver", pid => {
    console.log(pid)
  peer.signal(pid)
})
peer.on('connect', function()  {
   isconnected=true
  })

peer.on("data",function(data){
    hispos=data
})