import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const lotteryAddress = '0x3E3159F41E9988FCb7914711eA97aa9c289e4ACD'; // 스마트 컨트랙트 주소
const lotteryABI = [ { "inputs": [ { "internalType": "uint256", "name": "_winBlockNumber", "type": "uint256" }, { "internalType": "uint256", "name": "_seed", "type": "uint256" } ], "name": "SaveBetInfo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "components": [ { "internalType": "uint256", "name": "curBlockNumber", "type": "uint256" }, { "internalType": "uint256", "name": "winBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "uint256", "name": "seed", "type": "uint256" }, { "internalType": "bytes32", "name": "seedtobyte", "type": "bytes32" } ], "internalType": "struct Blockcontract.BetInfo", "name": "newBet", "type": "tuple" } ], "name": "OpenWinner", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true } ]; // 스마트 컨트랙트 ABI 배열

function App() {
  const [lotteryContract, setLotteryContract] = useState(null);
  const [bettingInProgress, setBettingInProgress] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [betInfo, setBetInfo] = useState(null);
  const [betResult, setBetResult] = useState('');

  useEffect(() => {
    initWeb3();
  }, []);

  async function initWeb3() {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log('Ethereum browser not detected. Try installing MetaMask.');
        return;
      }

      setLotteryContract(new window.web3.eth.Contract(lotteryABI, lotteryAddress));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function placeBet() {
    setBettingInProgress(true);
    // Call SaveBetInfo function
    await lotteryContract.methods.SaveBetInfo(0, 0).send({ from: await getSelectedAccount() });
    setBettingInProgress(false);
    setCountdown(10);

    // Start the countdown timer
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
  }

  async function getSelectedAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0];
  }

  async function openWinner() {
    if (!betInfo) return;

    const response = await lotteryContract.methods.OpenWinner(betInfo).call();
    setBetResult(response);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lottery Betting App</h1>
        <button onClick={placeBet} disabled={bettingInProgress}>
          {bettingInProgress ? 'Placing Bet...' : 'Place Bet'}
        </button>
        <p>Countdown: {countdown} seconds</p>
        <button onClick={openWinner} disabled={!betInfo}>
          Open Winner
        </button>
        {betResult && (
          <div>
            <p>Answer Hash: {betResult[0]}</p>
            <p>Seedtobyte: {betResult[1]}</p>
            <p>Matching Digits: {betResult[2]}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
