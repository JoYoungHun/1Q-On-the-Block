const TrophyToken = artifacts.require("TrophyToken");

module.exports = function(deployer) {
  deployer.deploy(TrophyToken);
};