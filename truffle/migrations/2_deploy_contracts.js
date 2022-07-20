var ERC721 = artifacts.require("./ERC721.sol");
var ImageFactory = artifacts.require("./ImageFactory.sol");
var ImageOwnership = artifacts.require("./ImageOwnership.sol");
var Ownable = artifacts.require("./Ownable.sol");
var SafeMath = artifacts.require("./SafeMath");

module.exports = function (deployer) {
  deployer.deploy(ERC721);
  deployer.deploy(ImageFactory);
  deployer.deploy(ImageOwnership);
  deployer.deploy(Ownable);
  deployer.deploy(SafeMath);
};
