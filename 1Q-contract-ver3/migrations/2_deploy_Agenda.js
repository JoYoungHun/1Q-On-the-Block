// const Agenda = artifacts.require("Agenda");

// module.exports = function(deployer) {
//   deployer.deploy(Agenda);
// };


const Agenda = artifacts.require("Agenda");

module.exports = function(deployer) {
  deployer.deploy(Agenda, "Title", "AgendaType", 123456, 789012);
};