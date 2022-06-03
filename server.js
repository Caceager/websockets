//jshint esversion:10
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');


const { engine } = require('express-handlebars');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const server = http.createServer(app);
const io = socketio(server);


productos = [];
try{
  mensajes = fs.readFileSync('mensajes.txt');
  mensajes = JSON.parse(mensajes);
}
catch{
  mensajes = fs.writeFileSync('mensajes.txt', '[]');
  mensajes = [];
}


app.use(express.static('public'));

const port = 8080;

io.on('connection', (socket) =>{
  console.log('conexion');
  io.sockets.emit('productos', productos);
  io.sockets.emit('mensajes', mensajes);

  socket.on('nuevo producto', (producto) =>{
    productos.push(producto);
    io.sockets.emit('productos', productos);
  })

  socket.on('nuevo mensaje', (mensaje) =>{
    mensajes.push(mensaje);
    fs.writeFileSync('mensajes.txt', JSON.stringify(mensajes));
    io.sockets.emit('mensajes', mensajes);
  })
});

server.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});
