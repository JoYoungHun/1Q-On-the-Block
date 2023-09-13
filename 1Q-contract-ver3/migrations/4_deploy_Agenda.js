// const Agenda = artifacts.require("Agenda");

// module.exports = function(deployer) {
//   deployer.deploy(Agenda);
// };


const Agenda = artifacts.require("Agenda");

module.exports = function(deployer) {
  // 테스트용
  // deployer.deploy(Agenda);

  deployer.deploy(Agenda, "Title", "AgendaType", 123456, 789012, '0xE4bB04E5a770A04374394361C673e781EA789f29','0xD47e76073582c3299D42409a5da264618f518E9E', '0xf35B1F8986B42b3B0b0F0A19726D2cB29C1791B0');
};