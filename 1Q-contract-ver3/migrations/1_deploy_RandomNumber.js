const RandomNumber = artifacts.require("RandomNumber");

module.exports = function(deployer) {
  deployer.deploy(RandomNumber);
};