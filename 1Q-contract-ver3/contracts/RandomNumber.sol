// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract RandomNumber {

    address public owner;

    constructor () public {
        owner = msg.sender;
    }

    address[] private applicants; // 응모자 배열
    uint256 private resultXOR = 0; // 응모자들이 입력한 값들을 XOR 연산 한 값
    uint256[] private randNumList; // 생성된 랜덤 번호

    uint256 curBlockNum;
    uint256 futureBlockNum;
    bytes32 futureBlockHash;

    // 응모하기
    function application(uint256 inpNum) public {
        applicants.push(msg.sender);
        resultXOR ^= inpNum;
    }    

    // 블록 고정
    function setBlockInfo() public{
        curBlockNum = block.number;
        futureBlockNum = curBlockNum + (curBlockNum % 5) + 5;
    }


    // 배열 특정 원소가 안에 있는지 확인
    function inArray(uint256[] memory tempArray ,uint256 value) private returns(bool){
        for (uint256 i = 0 ; i < tempArray.length ; i++) {
            if(tempArray[i] == value) {
                return true;
            }
        }
        return false;
    }


    function generateRandNum(uint256 num) public {
        uint256 _lenAppli = applicants.length;
        if (_lenAppli < 1) { // 참여자가 없을 경우 생성 불가
            revert("no applicant. can't generate random Number");
        }
        else if (_lenAppli <= num) { // 참여자의 숫자보다 당첨 인원이 같거나 많을 경우 생성이 불필요
            revert("All applicants are winner");
        }

        // 미래 블록 해시 저장
        futureBlockHash = blockhash(futureBlockNum);
        
        uint256 cnt = 0;
        // num 만큼 랜덤값을 생성
        for (uint256 i = 0; i < num; i++) {
            // 랜덤값 생성
            uint256 randNum = uint256(keccak256(abi.encodePacked(block.timestamp, futureBlockHash, resultXOR + cnt ))) % _lenAppli;
            // 랜덤값이 이미 존재하는 값이라면 추가 x
            if(inArray(randNumList,randNum)) {
                i--;
            }
            else {
                randNumList.push(randNum);
            }
            cnt++;
        }                   
    }

    // 생성된 랜덤 번호 반환
    function getrandlist() public view returns(uint256[] memory) {
        return randNumList;
    }

    function getAllInfo() public view returns(address[] memory, uint256, uint256, uint256, bytes32, uint256[] memory) {
        
        return (applicants, resultXOR, curBlockNum, futureBlockNum, futureBlockHash, randNumList);
    }




    // 전체 변수 초기화
    function optAll() public{
        uint256 _len = applicants.length;
        for(uint256 i = 0 ; i < _len ; i++) {
            applicants.pop();
        }
        
        _len = randNumList.length;
        for(uint256 i = 0 ; i < _len ; i++) {
            randNumList.pop();
        }

        resultXOR = 0;
    }

    // 응모자만 제외하고 초기화 (테스트용)
    function optAllExceptAppl() public{
        uint256 _len = applicants.length;

        // uint256 _len = applicants.length;
        // for(uint256 i = 0 ; i < _len ; i++) {
        //     applicants.pop();
        // }

        _len = randNumList.length;
        for(uint256 i = 0 ; i < _len ; i++) {
            randNumList.pop();
        }

        resultXOR = 0;
    }


}
