// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

import React, { useEffect, useState } from 'react';


const ContractAddress = '0xa7604614916399CBB11d2A158b92eAc19257CDA0';
const ContractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "inpNum", "type": "uint256" } ], "name": "application", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "setBlockInfo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "generateRandNum", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getrandlist", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "optAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "optAllExceptAppl", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

function App() {
  // 컨트랙트와 상호작용하기 위한 변수
  const [lotteryContract, setLotteryContract] = useState(null);
  // 컨트랙트 소유 계정
  const [account, setAccount] = useState("");
  // 랜덤 넘버 오픈 버튼 활성화/비활성화
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // 카운트 다운
  // const [countdown, setCountdown] = useState(10);
  const [inpNum, setinpNum] = useState("");




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
      let contract = new window.web3.eth.Contract(ContractABI, ContractAddress);

      setLotteryContract(contract);

      const account = await contract.methods.owner().call();
      setAccount(account);

      console.log("초기화 완료")

    } catch (error) {
      console.error('오류 발생:', error);
    }
  }

  const apply = async () => {
    try {
      const nonce = await window.web3.eth.getTransactionCount(account);
      await lotteryContract.methods.application(inpNum).send({
        from: account,
        nonce: nonce,
      });

      console.log('saved successfully!');
    } catch (error) {
      console.error('Error saving bet:', error);
    }
  }


  const setBlockAndDraw = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);

    await lotteryContract.methods.setBlockInfo().send({
      from: account,
      nonce: nonce,
    });

    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("10초 끝");

    await lotteryContract.methods.generateRandNum(3).send({
      from: account,
      nonce: nonce,
    });

    console.log("generate complete!")
    getrandlist();

  }

  const getrandlist = async () => {
    let non = await lotteryContract.methods.getrandlist().call();
    console.log(non);
  }

  const delall = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);
    await lotteryContract.methods.optAll().send({
      from: account,
      nonce: nonce,
    });
    console.log("delete all complete!!")
  }

  const delAllExceptApl = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);
    await lotteryContract.methods.optAllExceptAppl().send({
      from: account,
      nonce: nonce,
    });
    console.log("delete complete!!")
  }
  
  

  // const drawlot = async () => {

  //   try {
  //     const nonce = await window.web3.eth.getTransactionCount(account);
  //     await lotteryContract.methods.draw().send({
  //       from: account,
  //       nonce: nonce,
  //     });
  //     console.log("draw complete!!")
  //       // 카운트 다운을 시작하고 버튼을 비활성화로 바꿈
  //       setCountdown(10);
  //       setIsButtonDisabled(true);
        
  //       const countdownInterval = setInterval(() => {
  //         setCountdown((prevCount) => prevCount - 1);
  //       }, 1000);

  //       // 10초 후 카운트 다운을 리셋하고, 버튼을 활성화로 바꿈
  //       setTimeout(() => {
  //         clearInterval(countdownInterval);
  //         setIsButtonDisabled(false);
  //         setCountdown(10);
  //       }, 10000);
  //     }catch(error) {
  //       console.error('Error drawing:', error);
  //     }
  // }

  
  
  


  return (
    <div className="App">
      <h1>1Q On The Block</h1>
      <input
        type="number"
        value={inpNum}
        onChange={(e) => setinpNum(Number(e.target.value))}
      />
      <button onClick={apply} /*disabled={isButtonDisabled}*/>
        apply
      </button>

      {/* 랜덤 넘버 공개 */}
      <button onClick={setBlockAndDraw} disabled={isButtonDisabled} >
        draw
        {/* {isButtonDisabled ? `Generate RandNum... (${countdown}s)` : 'draw' } */}
      </button>
      <button onClick={delall}>delall</button>
      <button onClick={delAllExceptApl}>delAllExceptApl</button>
      <button onClick={getrandlist}>getrandlist</button>

      {/* openWinnerResult이 존재하면 display */}
      {/* {openWinnerResult && (
        <div>
          { <p>당첨자: {openWinnerResult}</p>}
        </div>    
      )} */}


    </div>
  );
}

export default App;
