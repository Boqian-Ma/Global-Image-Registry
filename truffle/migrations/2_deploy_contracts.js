const ImageOwnership = artifacts.require("./ImageOwnership.sol");
// Fairly sure we only need to include the highest level contract
// All contracts inherited by ImageOwnership are included during compilation 
// and we only need to deploy the ownership contract

module.exports = function (deployer) {
  deployer.deploy(ImageOwnership);
};
