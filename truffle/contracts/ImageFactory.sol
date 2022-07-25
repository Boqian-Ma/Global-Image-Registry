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
    
    //HM: Note – I don't think it's necessary to have the license struct unless we do fixed-term licenses. Instead we can just say all licenses are unlimited
    //let's discuss
    
    /*
    struct Licence {
        type, enum that represents different, lifespan etc
        address owner;
        date? expiry;
        uint256 value?;
    }
    */
    struct Image {
        address payable owner;                                      //HM: added owner variable
        uint IdNum;                                                 //HM: added IdNum
        string title;
        string description;
        bytes32 hash;
        string ipfs;
        // string[] tags;
        uint32 creationTime;
        bool forSale;
        bool forLicense;                                            //HM: added bool for whether image is listed for license
        uint256 price; // price is measured in wei
        uint256 priceLicense                                        //HM: added price for image licensing (vs price of outright buying the copyright)
        mapping(uint256 => License) private licenseHistory;         //HM: added mapping for license history
        uint256 numLicenses;                                        //HM: added for storing # of licenses on image
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
        string memory _title,
        string memory _description,
        bytes32 _hash,
        string memory _ipfs
    ) internal {
        uint32 creationTime = uint32(block.timestamp);

        images.push(
            Image(_title, _description, _hash, _ipfs, creationTime, false, 0)
        );
        // uint id = images.push(Image(_name, _description,  _hash, _ipfs, creationTime)) - 1;

        emit NewImage(
            numImages,
            _title,
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
        string memory _title,
        string memory _description,
        string memory _hash,
        string memory _ipfs
    ) public {
        // comparing strings in solidity requires both to be hashed to bytes first, then compared
        // storing the hash as the bytes object reduces number of times we will need to hash strings
        bytes32 imageHashBytes = keccak256(abi.encodePacked(_hash));
        require(
            imageHashToIndex[imageHashBytes].exists == false,
            "Image already exists in contract"
        );
        _createImage(_title, _description, imageHashBytes, _ipfs);
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
