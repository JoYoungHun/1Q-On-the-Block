const Blockcontract = artifacts.require("Blockcontract");

module.exports = function(deployer) {
  deployer.deploy(Blockcontract);
};