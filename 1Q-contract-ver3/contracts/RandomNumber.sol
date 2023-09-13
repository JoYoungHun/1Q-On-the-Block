// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract RandomNumber {

    uint256[] public randNumList; // 생성된 랜덤 번호

    uint256 public curBlockNum;
    uint256 public futureBlockNum;
    bytes32 public futureBlockHash;
    uint256 public curTimestamp;

    // 배열 특정 원소가 안에 있는지 확인
    function inArray(uint256[] memory tempArray ,uint256 value) private returns(bool){
        for (uint256 i = 0 ; i < tempArray.length ; i++) {
            if(tempArray[i] == value) {
                return true;
            }
        }
        return false;
    }

    // 블록 고정
    function setBlockInfo() public{
        curBlockNum = block.number;
        futureBlockNum = curBlockNum + (curBlockNum % 5) + 1;
        curTimestamp = block.timestamp;
    }

    // 랜덤 번호 생성
    function generateRandNum(uint256 num, uint256 numOfApp, uint256 resultXOR) public returns(uint256[] memory){
        if (numOfApp < 1) { // 참여자가 없을 경우 생성 불가
            revert("no applicant. can't generate random Number");
        }
        else if (numOfApp <= num) { // 참여자의 숫자보다 당첨 인원이 같거나 많을 경우 생성이 불필요
            revert("All applicants are winner");
        }

        // 미래 블록 해시 저장
        futureBlockHash = blockhash(futureBlockNum);
        
        uint256 cnt = 0;
        // num 만큼 랜덤값을 생성
        for (uint256 i = 0; i < num; i++) {
            // 랜덤값 생성
            uint256 randNum = uint256(keccak256(abi.encodePacked(curTimestamp, futureBlockHash, resultXOR + cnt ))) % numOfApp;
            // 랜덤값이 이미 존재하는 값이라면 추가 x
            if(inArray(randNumList,randNum)) {
                i--;
            }
            else {
                randNumList.push(randNum);
            }
            cnt++;
        }

        return randNumList;                   
    }

    // 전체 변수 초기화
    function optAll(uint256 num) public{
        for(uint256 i = 0 ; i < num ; i++) {
            randNumList.pop();
        }

        curBlockNum = 0;
        futureBlockNum = 0;
        futureBlockHash = 0;
        curTimestamp = 0;
    }

    // 테스트용
    function getInfo() public view returns(uint256, uint256, bytes32, uint256) {
        return (curBlockNum, futureBlockNum, futureBlockHash, curTimestamp);
    }
}
