// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Ownable.sol";

contract ImageFactory is Ownable {

    event NewImage(uint imageID, string title, string description, string hash, string ipfs, uint32 creationTime);
    
    struct Image {
      string title;
      string description;
      string hash;
      string ipfs;
      // string[] tags;
      uint32 creationTime;
    }

    // Holds all images on the website
    Image[] public images;

    uint numImages;
    mapping (uint => address) public imageToOwner;
    mapping (address => uint) ownerImageCount;

    function _createImage(string memory _name, string memory _hash, string memory _description, string memory _ipfs) internal {
        
        uint32 creationTime = uint32(block.timestamp);

        images.push(Image(_name, _description,  _hash, _ipfs, creationTime));
        // uint id = images.push(Image(_name, _description,  _hash, _ipfs, creationTime)) - 1;

        emit NewImage(numImages, _name, _description, _hash, _ipfs, creationTime);

        imageToOwner[numImages] = msg.sender;
        ownerImageCount[msg.sender]++;
        numImages++;
        
    }

    // function _generateRandomDna(string memory _str) private view returns (uint) {
    //     uint rand = uint(keccak256(abi.encodePacked(_str)));
    //     return rand % dnaModulus;
    // }

    // function createRandomZombie(string memory _name) public {
    //     require(ownerZombieCount[msg.sender] == 0);
    //     uint randDna = _generateRandomDna(_name);
    //     randDna = randDna - randDna % 100;
    //     _createZombie(_name, randDna);
    // }

}
