import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  AppBar,
  Typography,
  Toolbar,
  Input,
} from '@material-ui/core'
import Peer from 'peerjs'
import { ethers } from 'ethers'
import axios from 'axios'

import './App.css'
import Merkle from './utils/merkle'

import FileVerify from './contracts/FileVerify.json'

function App() {
  const [peerId, setPeerId] = useState('')
  const [isSetup, setIsSetup] = useState(true)
  const [page, setPage] = useState('UPLOAD')
  const [peer, setPeer] = useState()
  const [provider, setProvider] = useState()
  // const [uploadedFiles, setUploadedFiles];

  const submit = text => {
    if (peerId) {
      if (window.web3) {
        const provider = new ethers.providers.Web3Provider(
          window.web3.currentProvider,
        )
        setProvider(provider)
        setPeer(
          new Peer(peerId, {
            host: 'localhost',
            port: 9000,
            path: '/peerjs/fileshare',
          }),
        )

        setIsSetup(false)
      }
    }
  }

  return (
    <div className="App">
      {!isSetup && (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" onClick={() => setPage('UPLOAD')}>
                Upload
              </Button>
              <Button color="inherit" onClick={() => setPage('DOWNLOAD')}>
                Download
              </Button>
              <Typography variant="h6">{peerId}</Typography>
            </Toolbar>
          </AppBar>
          {page === 'UPLOAD' && <Upload peerId={peerId} provider={provider} />}
          {page === 'DOWNLOAD' && <Download peerId={peerId} />}
        </div>
      )}
      <SetUpScreen
        text={peerId}
        setText={setPeerId}
        show={isSetup}
        submit={submit}
      />
    </div>
  )
}

function Upload({ peerId, provider }) {
  const [uploadedFiles, setUploadedFiles] = useState()
  const [filesInfo, setFilesInfo] = useState()
  const [merkleRoot, setMerkleRoot] = useState()
  const [merkleProofs, setMerkleProofs] = useState()
  const [pk, setPk] = useState("")
  useEffect(() => {
    if ((uploadedFiles && filesInfo && merkleRoot, merkleProofs)) {
      let wallet = new ethers.Wallet(pk, provider)

      const fileVerifyFactory = new ethers.ContractFactory(FileVerify.abi, FileVerify.bytecode, wallet)
      fileVerifyFactory.deploy(merkleRoot).then(contract => {
        axios
          .post('http://localhost:9000/upload', {
            peerId,
            filesInfo,
            merkleRoot,
            merkleProofs,
            contractAddress: contract.address
          })
          .then(res => {
            console.log(res)
          })
      })
    }
  }, [uploadedFiles, filesInfo, merkleRoot, merkleProofs, pk])

  const upload = files => {
    console.log(files)
    processFiles(0, files)
  }

  const processFiles = (
    currentFile,
    files,
    filesAsHex = [],
    _filesInfo = [],
  ) => {
    const file = files.item(currentFile)
    var reader = new FileReader()
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        const bufferAsHex = Array.prototype.map
          .call(new Uint8Array(evt.target.result), x =>
            ('00' + x.toString(16)).slice(-2),
          )
          .join('')
        filesAsHex.push(
          '0x' +
            Buffer.from(file.webkitRelativePath, 'utf-8').toString('hex') +
            bufferAsHex,
        )

        if (currentFile === files.length - 1) {
          setUploadedFiles({ filesAsHex })
          setFilesInfo(_filesInfo)
          setMerkleRoot(Merkle.root(filesAsHex))
          setMerkleProofs(filesAsHex.map(f => Merkle.proof(filesAsHex, f)))
        } else {
          processFiles(currentFile + 1, files, filesAsHex, [
            ..._filesInfo,
            { name: file.name, path: file.webkitRelativePath },
          ])
        }
      }
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <input
        onChange={e => upload(e.target.files)}
        type="file"
        webkitdirectory="true"
        mozdirectory="true"
        directory="true"
        multiple
      />
      <input type="text" value={pk} onChange={e => setPk(e.target.value)} placeholder="private key"/>
    </div>
  )
}

function Download({}) {
  useEffect(() => {
    axios.get('http://localhost:9000/getFilesUploaded').then(res => {
      console.log(res.data)
    })
  }, [])

  return <div></div>
}

function SetUpScreen({ text, setText, show, submit }) {
  if (!show) return null

  return (
    <div>
      <TextField
        placeholder="name"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button onClick={submit}>Submit</Button>
    </div>
  )
}

export default App
