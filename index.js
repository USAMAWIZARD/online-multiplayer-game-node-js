app = require("express");
server = app();
session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
server.use(session);                             //ses for managing users
sharedsession = require("express-socket.io-session");
var ser = server.listen(5000)
io = require('socket.io').listen(ser);
io.use(sharedsession(session));
require("ejs");
server.set("view engine", "ejs");
server.use(app.static(__dirname + '/views'));
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json());
onlineplayers={}
ingame=[]

io.on("connection",function(socket){
  socket.emit("onlineplayers",Object.values(onlineplayers))

  socket.on("addname",myname=>{

    console.log(myname,socket.id)
    onlineplayers[String(socket.id)]=myname
    socket.broadcast.emit("onlineplayers",[onlineplayers[socket.id]])

    if(Object.keys(onlineplayers).length>1)
    {
    onlinebutnotingame = Object.keys(onlineplayers).filter(x => !ingame.includes(x) );   //selecting a random player from the array
    console.log("online but not in game",onlinebutnotingame)
    if(onlinebutnotingame.length==1)
    socket.emit("everoneingame")
    else{
    randomplayersockid1=socket.id
    ingame.push(randomplayersockid1)
    onlinebutnotingame = Object.keys(onlineplayers).filter(x => !ingame.includes(x) )
    randomplayersockid2 = onlinebutnotingame[Math.floor(Math.random() * onlinebutnotingame.length)]; //player who are online but not in game
    ingame.push(randomplayersockid2)
    socket.emit("conrandomplayers",[randomplayersockid2,true])
    socket.to(randomplayersockid2).emit("conrandomplayers",[randomplayersockid1,false])
    console.log("playerfound")
    console.log(onlineplayers[randomplayersockid1],onlineplayers[randomplayersockid2])
    console.log("online players",Object.keys(onlineplayers))
    console.log("ingame",ingame)
  }
    }
    else{
      console.log()
      socket.emit("noonline")
    }
  
  })           
  
  
  //geting random players from online array
  socket.on("peerid",socandpeer=>{
    socket.to(socandpeer[1]).emit("reciver",socandpeer[0])
  })


  socket.on("disconnect",function(){
    socket.broadcast.emit("playerdisconnected",onlineplayers[socket.id])
    delete  onlineplayers[socket.id]
    ingame.splice(socket.id)
    })


    })

server.get('/',function(req,res){
res.render('playgame.ejs')
})
server.get('/quran',function(req,res){
res.render('quran.ejs')

})