const Agenda = artifacts.require("Agenda");

module.exports = function(deployer) {
  deployer.deploy(Agenda, "Title", "AgendaType", 123456, 789012, '0x8dCBAF8214e2C118d95f5BCaC35B5624d0668cDF','0xDDcAbbc0bfbce0ab77df9fda412A58Af62679E49', '0x357446185988cE7297189f6Ff065AfB41359404A', 'https://meta-net.hanati.co.kr:3000/stump/static/json/Stump_NFT_Metadata_dev_01.json');
};