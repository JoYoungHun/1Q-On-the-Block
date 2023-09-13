const PudingToken = artifacts.require("PudingToken");

module.exports = function(deployer) {
  deployer.deploy(PudingToken);
};