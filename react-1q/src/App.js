// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

import React, { useEffect, useState } from 'react';


const ContractAddress = '0x173e288B67bc8b799bcF62c978885bE3835FE080';
const ContractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "inpNum", "type": "uint256" } ], "name": "application", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "setBlockInfo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "generateRandNum", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getrandlist", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "getAllInfo", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "optAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "optAllExceptAppl", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];


function App() {
  // 컨트랙트와 상호작용하기 위한 변수
  const [contract, setContract] = useState(null);
  // 컨트랙트 소유 계정
  const [account, setAccount] = useState("");
  // 랜덤 넘버 오픈 버튼 활성화/비활성화
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // 카운트 다운
  const [countdown, setCountdown] = useState(10);
  const [inpNum, setinpNum] = useState("");
  const [result, setresult] = useState(null);
  const [time, settime] = useState(null);
  const [RandNum, setRandNum] = useState("");





  // useEffect(() => {
  //   // 컴포넌트가 마운트된 후 실행되는 코드
  //   // 컴포넌트가 랜더링 될 때마다 실행된다.

  //   // initWeb3 함수 호출하여 Ethereum 관련 초기화 작업 수행
  //   initWeb3();
  
  //   return () => {
  //     // 컴포넌트가 언마운트되거나 업데이트되기 직전에 실행되는 코드 (cleanup)
  //   };
  
  //   // useEffect의 두 번째 인자로 전달되는 배열 ([])은 "의존성 배열" 또는 "의존성 리스트"라고 불림
  //   // 주로 컴포넌트가 최초로 렌더링될 때 초기화 작업이나 데이터 가져오기 등을 수행할 때 사용
  // }, []);

  const initWeb3 = async () => {
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

      setContract(contract);

      const account = await contract.methods.owner().call();
      setAccount(account);

      console.log("초기화 완료")

    } catch (error) {
      console.error('오류 발생:', error);
    }
  }
  // Unix timestamp (초 단위)를 받아서 Date 객체로 변환
  function unixTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000); // 초 단위 타임스탬프를 밀리초 단위로 변환
    const year = date.getFullYear(); // 연도
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 1을 더하고 2자리로 포맷)
    const day = String(date.getDate()).padStart(2, '0'); // 일
    const hours = String(date.getHours()).padStart(2, '0'); // 시간
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
    const seconds = String(date.getSeconds()).padStart(2, '0'); // 초

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  const apply = async () => {
    try {
      const nonce = await window.web3.eth.getTransactionCount(account);
      await contract.methods.application(inpNum).send({
        from: account,
        nonce: nonce,
      });

      console.log('saved successfully!');
    } catch (error) {
      console.error('Error saving bet:', error);
    }
  }

  const getAll = async () => {
    let non = await contract.methods.getAllInfo().call();
    setresult(non);
    settime(unixTimestampToDate(non[6]));
    setRandNum(Number(non[5]))
    console.log(non);
    console.log(non[0]);
  }


  const setBlockAndDraw = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);

    await contract.methods.setBlockInfo().send({
      from: account,
      nonce: nonce,
    });
    setCountdown(15);
    setIsButtonDisabled(true);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // 10초 후 카운트 다운을 리셋하고, 버튼을 활성화로 바꿈
    setTimeout(() => {
      clearInterval(countdownInterval);
      setIsButtonDisabled(false);
      setCountdown(15);
    }, 15000);

    await new Promise(resolve => setTimeout(resolve, 15000));
    console.log("15초 끝");

    await contract.methods.generateRandNum(1).send({
      from: account,
      nonce: nonce,
    });

    console.log("generate complete!")
    getAll();

  }

  const delall = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);
    await contract.methods.optAll().send({
      from: account,
      nonce: nonce,
    });
    setRandNum("")
    console.log("delete all complete!!")
  }

  const delAllExceptApl = async () => {
    const nonce = await window.web3.eth.getTransactionCount(account);
    await contract.methods.optAllExceptAppl().send({
      from: account,
      nonce: nonce,
    });
    setRandNum("")
    console.log("delete complete!!")
  }

  
  


  return (
    <div className="App">
      <h1>1Q On The Block</h1>
      <input
        type="number"
        value={inpNum}
        onChange={(e) => setinpNum(Number(e.target.value))}
      />
      <button onClick={apply} disabled={isButtonDisabled}>
        응모하기
      </button>

      {/* 랜덤 넘버 공개 */}
      <button onClick={setBlockAndDraw} disabled={isButtonDisabled}>
        {isButtonDisabled ? `당첨번호 생성중... (${countdown}s)` : '랜덤 번호 뽑기' }
      </button>
      <button onClick={delall} disabled={isButtonDisabled}>모두 초기화</button>
      <button onClick={delAllExceptApl} disabled={isButtonDisabled}>테스트용 초기화</button>
      <button onClick={getAll} disabled={isButtonDisabled}>
        모든 정보 공개
        {/* {isButtonDisabled ? `Generate RandNum... (${countdown}s)` : '모든 정보 공개' } */}
      </button>
      <button onClick={initWeb3} disabled={isButtonDisabled}>메타마스크 연결</button>


      {/* display */}
      {result && (
        <div>
          { <p>응모자: {result[0].length}</p>}
          { <p>XOR 연산값: {result[1]}</p>}
          { <p>현재 블록: {result[2]}</p>}
          { <p>미래 블록: {result[3]}</p>}
          { <p>블록 생성 시간: {time}</p>}
          { <p>미래 블록 해시값: {result[4]}</p>}
          { <p>당첨 번호: {RandNum+1}</p>}


        </div>    
      )}


    </div>
  );
}

export default App;
