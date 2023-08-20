import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

import React, { useEffect, useState } from 'react';


const lotteryAddress = '0x79927D7df76698C6B38bB1ac5c7bDd1D280aA7B8';
const lotteryABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "_seed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "applicant",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "randNum",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "application",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "seed",
        "type": "uint256"
      }
    ],
    "name": "getInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getSeed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "deleteApl",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "draw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRand",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

function App() {
  const [lotteryContract, setLotteryContract] = useState(null);
  const [seednum, setSeednum] = useState("");
  const [account, setAccount] = useState("");
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [countdown, setCountdown] = useState(10);
  const [openWinnerResult, setOpenWinnerResult] = useState(null);
  const [randNum, setrandNum] = useState(null);




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
    try {
      const nonce = await window.web3.eth.getTransactionCount(account);
      let a = await lotteryContract.methods.application().send({
        from: account,
        nonce: nonce,
      });

      console.log(a);

      console.log('saved successfully!');


      // Start the countdown and disable the button
      // setCountdown(10);
      // setIsButtonDisabled(true);
      
      // const countdownInterval = setInterval(() => {
      //   setCountdown((prevCount) => prevCount - 1);
      // }, 1000);

      // // After 10 seconds, reset the countdown and enable the button
      // setTimeout(() => {
      //   clearInterval(countdownInterval);
      //   setIsButtonDisabled(false);
      //   setCountdown(10);
      // }, 10000);

    } catch (error) {
      console.error('Error saving bet:', error);
    }
  }

  const openWinner = async () => {
    try {
      //const currentBet = /* Create a BetInfo object based on user input */
      const result = await lotteryContract.methods.getInfo(0).call();

      // Set the OpenWinner result
      setOpenWinnerResult(result);
    } catch (error) {
      console.error('Error opening winner:', error);
    }
  }

  const openRandNum = async () => {
    const rand = await lotteryContract.methods.getRand().call();
    console.log(rand)
    setrandNum(rand.toString());
  }

  const getseednum = async () => {
    let seedd = (await lotteryContract.methods.getSeed().call());
    console.log(seedd);
    setSeednum(seedd.toString());
    console.log("get seed complete")
  }

  const deletearray = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);
    await lotteryContract.methods.deleteApl().send({
      from: account,
      nonce: nonce,
    });
    console.log("delete complete!!")
  }

  const drawlot = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);
    await lotteryContract.methods.draw().send({
      from: account,
      nonce: nonce,
    });
    console.log("draw complete!!")
  }

  
  
  


  return (
    <div className="App">
      <h1>1Q On The Block</h1>
      {/* <input
        type="number"
        value={seednum}
        onChange={(e) => setSeednum(Number(e.target.value))}
      /> */}
      <button onClick={saveBet} /*disabled={isButtonDisabled}*/>
        Save Info
        {/* {isButtonDisabled ? `Saving... (${countdown}s)` : 'Save Bet'} */}
      </button>

      <button onClick={openRandNum}>openRandNum</button>

      {/* Display the OpenWinner result */}
      {randNum && (
        <div>
          { <p>생성된 랜덤 번호: {randNum}</p>}
        </div>    
      )}

      <button onClick={getseednum}>get seednum</button>
      {seednum && (
        <div>
          { <p>응모한 사람 수: {seednum}</p>}
        </div>    
      )}

      <button onClick={deletearray}>delete array</button>

      <button onClick={openWinner}>openWinner</button>
      {openWinnerResult && (
        <div>
          { <p>응모한 사람 수: {openWinnerResult}</p>}
        </div>    
      )}

      <button onClick={drawlot}>draw</button>


    </div>
  );
}

export default App;
