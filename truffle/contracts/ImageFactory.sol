// SPDX-License-Identifier: MIT

pragma solidity >=0.5.1 <=0.8.15;
import "./Ownable.sol";

/// @notice Factory contract, facilitates creation and stores basic Image adata type
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
        uint32 creationTime;
        bool forSale;
        bool forLicence;
        uint256 price; // price is measured in wei
        uint256 priceLicence;
        address[] licences;
        uint256 numOfLicences;
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
        address[] memory licenceAddress;
        images.push(
            Image(
                _title,
                _description,
                _hash,
                _ipfs,
                creationTime,
                false,
                false,
                0,
                0,
                licenceAddress,
                0
            )
        );

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

    /// @notice Getter for the number of images stored in the contract
    function getNumImages() public view returns (uint256) {
        return numImages;
    }
}
