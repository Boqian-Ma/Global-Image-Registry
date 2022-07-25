// SPDX-License-Identifier: MIT

pragma solidity >=0.5.1 <=0.8.15;

import "./ImageFactory.sol";
import "./ERC721.sol";
import "./SafeMath.sol";

contract ImageOwnership is ImageFactory, ERC721X {
    using SafeMath for uint256;

    mapping(uint256 => address) imageApprovals;
    event ImageSold(
        uint256 tokenId,
        string title,
        address seller,
        address buyer,
        uint256 price
    );

    // ERC721 function overrides
    function balanceOf(address _owner)
        external
        view
        override
        returns (uint256)
    {
        return ownerImageCount[_owner];
    }

    function ownerOf(uint256 _tokenId)
        external
        view
        override
        returns (address)
    {
        return imageToOwner[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) private {
        ownerImageCount[_to] = ownerImageCount[_to].add(1);
        ownerImageCount[msg.sender] = ownerImageCount[msg.sender].sub(1);
        imageToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable override {
        require(
            imageToOwner[_tokenId] == msg.sender &&
                imageApprovals[_tokenId] == msg.sender,
            "Sender is not owner and image is not approved"
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId)
        external
        payable
        override
        onlyOwnerOf(_tokenId)
    {
        imageApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function isTokenApproved(uint256 _tokenId) public view returns (bool) {
        return imageToOwner[_tokenId] == imageApprovals[_tokenId];
    }

    // Selling functions
    function listImage(uint256 _tokenId, uint256 _price)
        external
        onlyOwnerOf(_tokenId)
        imageIsApproved(_tokenId)
    {
        require(_price > 0, "Price cannot be less than 0 wei");
        images[_tokenId].forSale = true;
        images[_tokenId].price = _price;
    }

    function changeListingPrice(uint256 _tokenId, uint256 _price)
        public
        onlyOwnerOf(_tokenId)
        imageIsListed(_tokenId)
    {
        require(_price > 0, "New price must be greater than 0");
        images[_tokenId].price = _price;
    }

    function unlistImage(uint256 _tokenId)
        external
        onlyOwnerOf(_tokenId)
        imageIsListed(_tokenId)
    {
        images[_tokenId].forSale = false;
    }

    function buyImage(uint256 _tokenId) public payable imageIsListed(_tokenId) {
        Image storage image = images[_tokenId];
        require(msg.value >= image.price, "Insufficient price to buy image");
        address payable buyer = payable(msg.sender);
        address payable seller = payable(imageToOwner[_tokenId]);
        seller.transfer(msg.value);
        image.forSale = false;
        _transfer(seller, buyer, _tokenId);
        emit ImageSold(_tokenId, image.title, seller, buyer, msg.value);
    }

    // helpers
    // returns image information, currently does not include IPFS as we may want to encrypt it
    function getImageDetails(uint256 _tokenId)
        external
        view
        returns (
            string memory title,
            string memory description,
            bool forSale,
            uint256 price
        )
    {
        Image memory retImg = images[_tokenId];
        forSale = images[_tokenId].forSale;
        return (retImg.title, retImg.description, forSale, retImg.price);
    }

    function getImageOwner(uint256 _tokenId) public view returns (address) {
        return imageToOwner[_tokenId];
    }

    modifier onlyOwnerOf(uint256 _imageId) {
        require(msg.sender == imageToOwner[_imageId], "Sender is not owner");
        _;
    }

    modifier imageIsApproved(uint256 _imageId) {
        require(isTokenApproved(_imageId), "Image is not approved");
        _;
    }

    modifier imageIsListed(uint256 _imageId) {
        require(images[_imageId].forSale == true, "Image is not for sale");
        _;
    }
}
