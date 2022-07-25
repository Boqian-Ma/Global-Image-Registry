// SPDX-License-Identifier: MIT

pragma solidity >=0.5.1 <=0.8.15;
import "./Ownable.sol";

contract ImageFactory is Ownable {
    event NewImage(
        uint256 imageID,
        string title,
        string description,
        bytes32 hash,
        string ipfs,
        uint32 creationTime
    );

    struct Image {
        string title;
        string description;
        bytes32 hash;
        string ipfs;
        // string[] tags;
        uint32 creationTime;
        bool forSale;
        uint256 price; // price is measured in wei
    }

    struct ImageIndex {
        uint256 arrayIndex;
        bool exists;
    }

    // Holds all images on the website
    Image[] public images;

    uint256 numImages;
    mapping(uint256 => address) public imageToOwner;
    mapping(address => uint256) ownerImageCount;

    // Structure required for O(1) lookup if image already exists in contract, prevent duplicates
    mapping(bytes32 => ImageIndex) public imageHashToIndex;

    function _createImage(
        string memory _name,
        bytes32 _hash,
        string memory _description,
        string memory _ipfs
    ) internal {
        uint32 creationTime = uint32(block.timestamp);

        images.push(
            Image(_name, _description, _hash, _ipfs, creationTime, false, 0)
        );
        // uint id = images.push(Image(_name, _description,  _hash, _ipfs, creationTime)) - 1;

        emit NewImage(
            numImages,
            _name,
            _description,
            _hash,
            _ipfs,
            creationTime
        );
        imageHashToIndex[_hash] = ImageIndex(numImages, true);
        imageToOwner[numImages] = msg.sender;
        ownerImageCount[msg.sender]++;
        numImages++;
    }

    function createNewImage(
        string memory _name,
        string memory _hash,
        string memory _ipfs,
        string memory _description
    ) public {
        // comparing strings in solidity requires both to be hashed to bytes first, then compared
        // storing the hash as the bytes object reduces number of times we will need to hash strings
        bytes32 imageHashBytes = keccak256(abi.encodePacked(_hash));
        require(
            imageHashToIndex[imageHashBytes].exists == false,
            "Image already exists in contract"
        );
        _createImage(_name, imageHashBytes, _description, _ipfs);
    }

    function getNumImages() public view returns (uint256) {
        return numImages;
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
