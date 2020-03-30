pragma solidity ^0.5.0;

contract FileVerify {
    bytes32 merkleRoot;

    constructor(bytes32 merkleRoot_) public {
        merkleRoot = merkleRoot_;
    }

    function leafHash(bytes memory leaf) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(uint8(0x00), leaf));
    }

    function nodeHash(bytes32 left, bytes32 right) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(uint8(0x01), left, right));
    }

    function verify(uint256 path, bytes32[] memory witnesses, bytes memory file) public view returns(bool) {
        bytes32 node = leafHash(file);
        
        for (uint i = 0; i < witnesses.length; i++) {
            if(path % 2 == 1) {
                node = nodeHash(witnesses[i], node);
            } else {
                node = nodeHash(node, witnesses[i]);
            }
            
            path /= 2;
        }
        
        return node == merkleRoot;
    }
}
