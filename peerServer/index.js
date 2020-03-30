const express = require('express')
const bodyParser = require('body-parser')
const { uuid } = require('uuidv4');

const { ExpressPeerServer } = require('peer')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var connected = []
var filesUploaded = []
var whoHasFiles = {}

app.get('/', function(req, res) {
  return res.json(connected)
})

app.get('/getFilesUploaded', function(req, res) {
  res.status(200).json({filesUploaded, whoHasFiles});
}) 

app.post('/upload', function(req, res) {
  const {peerId, filesInfo, merkleProofs, merkleRoot, contractAddress} = req.body;
  const filesId = uuid()
  filesUploaded.push({id: filesId, filesInfo, merkleProofs, merkleRoot, contractAddress});
  whoHasFiles[filesId] = [peerId];
  res.status(200).json({filesId});
});


const http = require('http')

const server = http.createServer(app)
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/fileshare',
})

peerServer.on('connection', function(id) {
  var idx = connected.indexOf(id) // only add id if it's not in the list yet
  if (idx === -1) {
    connected.push(id)
  }
})

peerServer.on('disconnect', function(id) {
  var idx = connected.indexOf(id) // only attempt to remove id if it's in the list
  if (idx !== -1) {
    connected.splice(idx, 1)
  }
})

app.use('/peerjs', peerServer)

server.listen(9000)
