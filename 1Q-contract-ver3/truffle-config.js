// module.exports = {
//   networks: {
//     development: {
//       host: "localhost",
//       port: 8545,
//       network_id: "*", // Match any network id
//       gas: 5000000
//     }
//   },
//   compilers: {
//     solc: {
//       settings: {
//         optimizer: {
//           enabled: true, // Default: false
//           runs: 200      // Default: 200
//         },
//       }
//     }
//   }
// };

// require('dotenv').config();

// const HDWalletProvider = require("@truffle/hdwallet-provider");

// module.exports = {
//   networks: {
//     development: {
//       provider: new HDWalletProvider("depart history damage chest either valid key improve father pumpkin three write", "https://meta-net.hanati.co.kr:8545"),
//       network_id: 22742,
//       gasPrice: 0x00,
//       disableConfirmationListener: true
//     },
//   },
//   mocha: {

//   },
//   compilers: {
//     solc: {
//       version: "0.8.0",
//     }
//   }
// };



require('dotenv').config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      provider: new HDWalletProvider("60e1ffdfd992939207fc387bcab6f38de3e66798bb56fedaa3c02e73aaf57172", "http://43.200.240.107:8545"),
      network_id: 22742,
      gasPrice: 0x00,
      disableConfirmationListener: true
    },
  },
  mocha: {

  },
  compilers: {
    solc: {
      version: "0.8.1",
    }
  }
};
