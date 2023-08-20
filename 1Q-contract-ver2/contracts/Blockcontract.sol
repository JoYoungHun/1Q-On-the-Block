// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Blockcontract {

    constructor() public {
        owner = msg.sender;
    }

    address public owner;
    //uint256 private curBlockNum; // 추첨 시작을 눌렀을 때 블록 번호 저장
    //uint256 private futureBlockNum; // 미래 블록 번호 = 트랜잭션이 들어간 블록 번호 + uint(curBlockNum) % 5

    mapping (uint256 => address) public applicant; // 응모자들을 저장할 매핑 (시드 번호 : 지갑 주소)
    uint256 public _seed = 0; // 시드 번호 (응모 순서대로 지급)

    uint256 private randNonce = 0; // 랜덤 논스 값
    uint256 public randNum; // 생성 된 랜덤 번호 (당첨 번호)

    // 응모하기
    function application() public returns(uint256){
        applicant[_seed] = msg.sender;
        _seed++;
        return _seed;
    }


    // 지정 seed를 가지고 있는 사람의 지갑 주소를 반환
    function getInfo(uint256 seed) public view returns (address) {
        return applicant[seed];
    }

    // 몇명이 응모했는지 반환
    function getSeed() public view returns (uint256) {
        return _seed;
    }

    // 응모자 배열을 비운다
    function deleteApl() public {
        for (uint256 i = 0; i < _seed; i++) {
            delete applicant[i];
        }
        _seed = 0;
    }


    // 베팅 정보 저장
    function draw() public{
        uint256 curBlockNum = block.number;
        uint256 futureBlockNum = curBlockNum + (curBlockNum % 5) + 5;
        randNum = uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce,futureBlockNum))) % _seed;
    }

    // 생성된 랜덤 값을 반환
    function getRand() public view returns(uint256) {
        return randNum;
    }

    // function confirmWin() public {

    // }
}
