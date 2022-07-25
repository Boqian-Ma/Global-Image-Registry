// SPDX-License-Identifier: MIT
pragma solidity >=0.5.1 <=0.8.15;

abstract contract ERC721X {
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );

    function balanceOf(address _owner) external view virtual returns (uint256);

    function ownerOf(uint256 _tokenId) external view virtual returns (address);

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable virtual;

    function approve(address _approved, uint256 _tokenId)
        external
        payable
        virtual;
}
