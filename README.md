# browser-torrent-client
For CRN-45542-201902 course assignment. This is a prrof-of-concept MVP not meant to be a functional workling torrent client and is currently incomplete.

## How it works

This application uses peerJS to transfer folders and files to each other while using the smart contract FileVerify.sol as merkle proofing so that the leecher
can verify that the files they are downloading have not been modified. An express/peerJS server is used as a moderator and trusted third party for each peer by
providing discovery, merkle witnesses, merkle path, addresses for each folders corresponding FileVerify contract, and information of files.
Thus, when a peer wants to leech a specific folder, a request is made to the express server for these things so that they know who to leech from and how to
verify that the seeder has not modified the contents of the folder.

### Client

A react client for uploading/seeding and downloading/leeching.

The user is required to have metamask to use this application. Their metamask is connected and a PeerJS peer is created upon the user inputting their name/id.

#### Upload

On the upload page the user would input their private key and chooose a folder to upload.
A new FileVerify is deployed and and the following is generated:

| filesAsHex      | concatonates the hex of the directory of the file and the file itself, and stores each into an array |
|-----------------|------------------------------------------------------------------------------------------------------|
| fileInfo        | array of the each files name and directory                                                           |
| merkleProofs    | The merkle witnessess and path of each file                                                                        |
| contractAddress | The address of the newly deployed FileVerify contract                                                |

and is sent to the express/PeerJS server to hold.

#### Download

// TODO

### Express/Peer Server

Endpoints

// TODO

## Security issues and bugs to resolve
Some common web development and wallet managing concerns were ignored due to the time constrait of this assignment 

- Metamask should notify the user to sign sign the transactions
- Implement token authentication when connecting to the peer server. One is supplied on peer creation but is not utilised.
- Proper input checking in the client and proper UI/UX flow and design
- Ideally, an uploader would sign the transaction to deploy the FileVerify Contract, send the sig to the server and the contract is deployed by the server as the merkle root can be manipulated before the contract creation.
