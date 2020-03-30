const FileVerify = artifacts.require('FileVerify')

const fs = require('fs')
const path = require('path')
const ethers = require('ethers')
const readFolder = require('./utils/readFolder')
const Merkle = require('./utils/merkle')

contract('FileVerify', accounts => {
  it('should correctly verify Merkle Proof', async () => {
    const directoryPath = path.join(__dirname, 'testDir')
    const filesRead = readFolder(directoryPath)

    const root = Merkle.root(filesRead)

    const fileVerify = await FileVerify.new(root)

    for (let i = 0; i < filesRead.length; i++) {
      const proof = Merkle.proof(filesRead, filesRead[i])
      const success = await fileVerify.verify(
        proof.path,
        proof.witnesses,
        filesRead[i],
      )
      assert.equal(success, true, 'File verification failed')
    }
  })
})
