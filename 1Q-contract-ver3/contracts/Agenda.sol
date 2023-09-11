// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomNumber.sol";

contract Agenda is Ownable{
    string private TITLE; // 제목
    string private AGENDA_TYPE; // 안건 유형
    uint256 private START_DATETIME; // TIMESTAMP
    uint256 private END_DATETIME; // TIMESTAMP

    uint256 private WINNERS_COUNT = 1; // 당첨자 수
 
    address[] private applicants = [0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79, 0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79];
    uint256 resultXOR = 0;

    uint256[] private winNum;
    address[] private winners;

    RandomNumber public randomnumber;

    constructor (string memory _Title, string memory _AgendaType, uint256 _StartDateTime, uint256 _EndDateTime) {
        transferOwnership(msg.sender);
        TITLE = _Title;
        AGENDA_TYPE = _AgendaType;
        START_DATETIME = _StartDateTime;
        END_DATETIME = _EndDateTime;
        randomnumber = RandomNumber(0x72E84aF2e061E1F138c4CBA397f81A9220BF5336);
    }

    // 배열 특정 원소가 안에 있는지 확인
    function inArray(address[] memory tempArray ,address applicant) private returns(bool){
        for (uint256 i = 0 ; i < tempArray.length ; i++) {
            if(tempArray[i] == applicant) {
                return true;
            }
        }
        return false;
    }

    function modifyInfo(string memory newTitle, string memory newAgendaType, uint256 newStartDateTime, uint256 newEndDateTime) public onlyOwner{
        TITLE = newTitle;
        AGENDA_TYPE = newAgendaType;
        START_DATETIME = newStartDateTime;
        END_DATETIME = newEndDateTime;
    }

    function setWinnerCount(uint256 num) public onlyOwner{
        WINNERS_COUNT = num;
    }

    function application(uint256 inpNum) public {
        if(inArray(applicants,msg.sender)) {
            revert("already application");
        }
        else {
            applicants.push(msg.sender);
            resultXOR ^= inpNum;
        }
    }

    function setBlockInfo() public{
        randomnumber.setBlockInfo();
    }

        

    function draw(uint256 num) public onlyOwner{
        // num 갯수만큼 랜덤 번호 생성
        winNum = randomnumber.generateRandNum(WINNERS_COUNT, applicants.length, resultXOR);

        // 생성된 랜덤 번호와 응모자 매칭
        for (uint256 i = 0 ; i < num ; i++) {
            winners.push(applicants[winNum[i]]);
        }

        randomnumber.optAll(num);
    }

    function getInfo() public view returns(string memory, string memory, uint256, uint256) {
        return (TITLE, AGENDA_TYPE, START_DATETIME, END_DATETIME);
    }


    // 테스트용
    function getWinNum() public view returns(uint256[] memory) {
        return winNum;
    }

    
    function getWinners() public view returns(address[] memory) {
        return winners;
    }

    function getRandInfo() public view returns(uint256, uint256, bytes32, uint256) {
        return randomnumber.getInfoo();
    }


}