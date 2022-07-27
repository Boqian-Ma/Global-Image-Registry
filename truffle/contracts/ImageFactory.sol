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

    // enum to store three licence types – these are the same types available on Getty Images (https://www.gettyimages.de/eula#:~:text=Getty%20Images%20offers%20three%20types,the%20content%20is%20re-used)
    enum LicenceType {
        RF,                 //"royalty free"
        RR,                 //"rights ready"
        RM                  //"rights managed"
    }

    struct Image {
        string title;
        string description;
        bytes32 hash;
        string ipfs;
        uint32 creationTime;
        bool forSale;                       // available for copyright sale
        bool forLicence;                    // available for licence sale
        LicenceType licenceType;
        uint256 price;                      // price for outright copyright purchase - measured in wei
        uint256 priceLicence;               // price for the licence purchase – measured in wei
        uint256 numOfLicences;              
        LicenceType[] licencesTypes;        // array to store active license types
        address[] licencesOwners;           // array to store the addresses with valid licences
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
        LicenceType[] memory licenceTypes;
        address[] memory licenceAddresses;
        Image memory newImage = Image(
            _title,
            _description,
            _hash,
            _ipfs,
            creationTime,
            false,
            false,
            LicenceType.RF,
            0,
            0,
            0,
            licenceTypes,
            licenceAddresses
        );
        images.push(newImage);

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
