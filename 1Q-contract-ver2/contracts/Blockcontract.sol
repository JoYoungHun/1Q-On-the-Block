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
    uint256 private _seed = 1; // 시드 번호 (응모 순서대로 지급)

    uint256 private randNonce = 0;
    uint256 private randNum;

    function application() public { // 응모하기
        applicant[_seed] = msg.sender;
        _seed++;
    }

    function getInfo(uint256 seed) public view returns (address) {
        return applicant[seed];
    }

    function deleteApl() public {
        for (uint256 i = 1; i < _seed; i++) {
            delete applicant[i];
        }
        _seed = 1;
    }


    // 베팅 정보 저장
    function draw() public{
        uint256 curBlockNum = block.number;
        uint256 futureBlockNum = curBlockNum + curBlockNum % 5 + 5;
        randNum = uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce,futureBlockNum)));
    }

    // function confirmWin() public {

    // }
}
