// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ImageFactory.sol";
import "./ERC721.sol";
import "./SafeMath.sol";

contract ImageOwnership is ImageFactory, ERC721X {
    using SafeMath for uint256;

    mapping(uint256 => address) imageApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerImageCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
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
    ) external payable {
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
        onlyOwnerOf(_tokenId)
    {
        imageApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function isTokenApproved(uint256 _tokenId) public view returns (bool) {
        return imageToOwner[_tokenId] == imageApprovals[_tokenId];
    }

    modifier onlyOwnerOf(uint256 _imageId) {
        require(msg.sender == imageToOwner[_imageId], "Sender is not owner");
        _;
    }
}
