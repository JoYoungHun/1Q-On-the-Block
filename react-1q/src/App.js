import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

import React, { useEffect, useState } from 'react';


const lotteryAddress = '0xF7a66886D540b1884606f850Ab65e63eD550a5C3';
const lotteryABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "calculateSHA256", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "pure", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "_seed", "type": "uint256" } ], "name": "SaveBetInfo", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "OpenWinner", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" } ];
function App() {
  const [lotteryContract, setLotteryContract] = useState(null);
  const [seednum, setSeednum] = useState("");
  const [account, setAccount] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [openWinnerResult, setOpenWinnerResult] = useState(null);



  useEffect(() => {
    // 컴포넌트가 마운트된 후 실행되는 코드
    // 컴포넌트가 랜더링 될 때마다 실행된다.

    // initWeb3 함수 호출하여 Ethereum 관련 초기화 작업 수행
    initWeb3();
  
    return () => {
      // 컴포넌트가 언마운트되거나 업데이트되기 직전에 실행되는 코드 (cleanup)
    };
  
    // useEffect의 두 번째 인자로 전달되는 배열 ([])은 "의존성 배열" 또는 "의존성 리스트"라고 불림
    // 주로 컴포넌트가 최초로 렌더링될 때 초기화 작업이나 데이터 가져오기 등을 수행할 때 사용
  }, []);

  async function initWeb3() {
    try {
      // 브라우저가 메타마스크를 지원하는지 확인
      if (window.ethereum) {
        console.log('최신 모드');
        // 이더리움 프로바이더 설정
        // 최신 모드에서는 window.ethereum.request를 사용하여 계정 접근권한 요청 가능
        window.web3 = new Web3(window.ethereum);

        // metamask 계정 접근 권한 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });


      } else if (window.web3) {
        console.log('레거시 모드');
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log('이더리움 브라우저가 아닙니다. MetaMask를 시도해보세요!');
        return;
      }
      let contract = new window.web3.eth.Contract(lotteryABI, lotteryAddress);

      setLotteryContract(contract);

      const account = await contract.methods.owner().call();
      setAccount(account);
      console.log('Owner:', account);



    } catch (error) {
      console.error('오류 발생:', error);
    }
  }

  const saveBet = async () => {
    if (!seednum) {
      console.log('Please enter a valid seed number.');
      return;
    }

    try {
      const nonce = await window.web3.eth.getTransactionCount(account);
      await lotteryContract.methods.SaveBetInfo(seednum).send({
        from: account,
        nonce: nonce,
      });

      console.log('Bet saved successfully!');


      // Start the countdown and disable the button
      setCountdown(10);
      setIsButtonDisabled(true);
      
      const countdownInterval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      // After 10 seconds, reset the countdown and enable the button
      setTimeout(() => {
        clearInterval(countdownInterval);
        setIsButtonDisabled(false);
        setCountdown(10);
      }, 10000);

    } catch (error) {
      console.error('Error saving bet:', error);
    }
  }

  const openWinner = async () => {
    try {
      //const currentBet = /* Create a BetInfo object based on user input */
      const result = await lotteryContract.methods.OpenWinner().call();

      // Set the OpenWinner result
      setOpenWinnerResult(result);
    } catch (error) {
      console.error('Error opening winner:', error);
    }
  }
  


  return (
    <div className="App">
      <h1>Lottery Betting App</h1>
      <input
        type="number"
        value={seednum}
        onChange={(e) => setSeednum(Number(e.target.value))}
      />
      <button onClick={saveBet} disabled={isButtonDisabled}>
        {isButtonDisabled ? `Saving... (${countdown}s)` : 'Save Bet'}
      </button>

      <button onClick={openWinner}>Open Winner</button>

      {/* Display the OpenWinner result */}
      {openWinnerResult && (
        <div>
          <h2>Open Winner Result</h2>
          <p>Answer Hash: {openWinnerResult[0]}</p>
          <p>Seed to Byte: {openWinnerResult[1]}</p>
          <p>Matching Digits: {openWinnerResult[2]}</p>
        </div>
      )}
    </div>
  );
}

export default App;
