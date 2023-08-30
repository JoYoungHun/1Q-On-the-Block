// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Blockcontract {

    constructor() public {
        owner = msg.sender;
    }

    // 컨트랙트 소유자
    address public owner;
   
    address[] public applicant; // 응모자 배열 (index = _seed)
    // uint256 public _seed = 0; // 시드 번호 (응모 순서대로 지급)

    uint256[] private nonceList; // 사용자들이 입력한 논스값 리스트
    uint256[] public randNumList; // 생성 된 랜덤 번호(당첨 번호) 리스트

    // 미래 생성될 블록
    uint256 futureBlockNum;
    bytes32 futureBlockHash;

    

    // 응모하기
    function application(uint256 nonce) public {
        applicant.push(msg.sender);
        _seed++;
        nonceList.push(nonce);
    }


    // 몇명이 응모했는지 반환
    function getSeed() public view returns (uint256) {
        return _seed;
    }

    // 응모자 배열을 초기화
    function deleteApl() public {
        for (uint256 i = 0; i < _seed; i++) {
            applicant.pop();
        }
        _seed = 0;
    }

    // 당첨 번호 리스트를 초기화
    function deleteRanList() public {
        uint256 _Loop = randNumList.length;
        for (uint256 i = 0; i < _Loop ; i++) {
            randNumList.pop();
        }
    }

    // 당첨 논스 리스트를 초기화
    function deleteNonceList() public {
        uint256 _Loop = nonceList.length;
        for (uint256 i = 0; i < _Loop ; i++) {
            nonceList.pop();
        }
    }

    function resetUintList(uint256[] storage tempArray) private {
        uint256 len = tempArray.length;
        for (uint256 i = 0; i < len ; i++) {
            tempArray.pop();
        }
    }

    function resetAddrList(address[] storage tempArray) private {
        uint256 len = tempArray.length;
        for (uint256 i = 0; i < len ; i++) {
            tempArray.pop();
        }
    }


    // 블록 정보 저장
    function setBlockInfo() public{
        uint256 curBlockNum = block.number;
        futureBlockNum = curBlockNum + (curBlockNum % 5) + 5;
    }


    function inArray(uint256[] memory tempArray ,uint256 value) private returns(bool){
        for (uint256 i = 0 ; i < tempArray.length ; i++) {
            if(tempArray[i] == value) {
                return true;
            }
        }
        return false;
    }


    // 랜덤값을 생성 후 배열에 저장
    function generateRandNum(uint256 num) public{
        if (_seed <= 0) { // 참여자가 없을 경우 생성 불가
            revert("no applicant. can't generate random Number");
        }
        else if (_seed <= num) { // 참여자의 숫자보다 당첨 인원이 많을 경우 추첨 불필요
            revert("All applicants are winner");
        }

        // 미래 블록 해시 저장
        futureBlockHash = blockhash(futureBlockNum);

        uint256 j;
        uint256 cnt = 0;

        // num 만큼 랜덤값을 생성
        for (uint256 i = 0; i < num; i++) {
            // 랜덤값 생성
            uint256 randNum = uint256(keccak256(abi.encodePacked(block.timestamp, futureBlockHash, nonceList[cnt] ))) % _seed;
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

    function getrandlist() public view returns(uint256[] memory) {
        return randNumList;

    }

    function getNonce() public view returns(uint256[] memory) {
        return nonceList;

    }

    // function getBlockInfo() public view returns (uint256[] memory){
    //     uint256[] memory blockInfo = new uint256[](2);
    //     blockInfo[0] = curBlockNum;
    //     blockInfo[1] = futureBlockNum;
    //     return blockInfo;
    // }

    function getFutureHash() public returns(bytes32){
        return futureBlockHash;
    }

}
