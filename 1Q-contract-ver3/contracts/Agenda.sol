// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomNumber.sol";
import "./TrophyToken.sol";
import "./PudingToken.sol";
import "./myToken.sol";

contract Agenda is Ownable{
    uint256 eth = 10**18;
    string private TITLE; // 제목
    string private AGENDA_TYPE; // 안건 유형
    uint256 private START_DATETIME; // TIMESTAMP
    uint256 private END_DATETIME; // TIMESTAMP

    uint256 private WINNERS_COUNT = 1; // 당첨자 수
 
    address[] private applicants = [0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79, 0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79, 0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79];
    uint256 resultXOR = 0;

    uint256[] private winNum;
    address[] private winners;
    
    RandomNumber public randomnumber;
    PudingToken public pudingtoken;
    TrophyToken public trophytoken;

    string imageURI; // NFT Image URL

    constructor (string memory _Title, string memory _AgendaType, uint256 _StartDateTime, uint256 _EndDateTime, address _randAddr, address _pudAddr, address _nftAddr, string _imageURI) {
        transferOwnership(msg.sender);
        TITLE = _Title;
        AGENDA_TYPE = _AgendaType;
        START_DATETIME = _StartDateTime;
        END_DATETIME = _EndDateTime;
        randomnumber = RandomNumber(_randAddr);
        pudingtoken = PudingToken(_pudAddr);
        trophytoken = TrophyToken(_nftAddr);
        imageURI = _imageURI;
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

    // 안건 정보 수정
    function modifyInfo(string memory newTitle, string memory newAgendaType, uint256 newStartDateTime, uint256 newEndDateTime) public onlyOwner{
        TITLE = newTitle;
        AGENDA_TYPE = newAgendaType;
        START_DATETIME = newStartDateTime;
        END_DATETIME = newEndDateTime;
    }

    // 당첨자 수 설정
    function setWinnerCount(uint256 num) public onlyOwner{
        WINNERS_COUNT = num;
    }

    // 푸딩 토큰 민팅
    function mintPDK(address to) public onlyOwner{
        pudingtoken.mint(to, 1*eth);
    }

    //응모하기
    function application(uint256 inpNum) public {
        if(inArray(applicants,msg.sender)) {
            revert("already application");
        }
        else {
            if(pudingtoken.balanceOf(msg.sender) < 1*eth) {
                revert("not enough token");
            }
            applicants.push(msg.sender);
            resultXOR ^= inpNum;
            pudingtoken.burn(msg.sender,1*eth);
        }
    }

    // 추첨하기
    function draw() public{
        // num 갯수만큼 랜덤 번호 생성
        winNum = randomnumber.generateRandNum(WINNERS_COUNT, applicants.length, resultXOR);

        // 생성된 랜덤 번호와 응모자 매칭
        for (uint256 i = 0 ; i < WINNERS_COUNT; i++) {
            winners.push(applicants[winNum[i]]);
            trophytoken.safeMint(winners[i], imageURL);
        }

        randomnumber.optAll(WINNERS_COUNT);
    }

    // 안건 정보 가져오기
    function getInfo() public view returns(string memory, string memory, uint256, uint256) {
        return (TITLE, AGENDA_TYPE, START_DATETIME, END_DATETIME);
    }


    // 테스트용 ////////////

    // 당첨 번호 배열 가져오기
    function getWinNum() public view returns(uint256[] memory) {
        return winNum;
    }

    // 당첨자 배열 가져오기
    function getWinners() public view returns(address[] memory) {
        return winners;
    }

    // 랜덤 번호 생성기 블럭 정보 가져오기
    function getRandInfo() public view returns(uint256, uint256, bytes32, uint256) {
        return randomnumber.getInfo();
    }

    function getAppInfo() public view returns(address[] memory, uint256) {
        return (applicants,resultXOR);
    }

    // 블록 정보 가져오기
    function setBlockInfo() public{
        randomnumber.setBlockInfo();
    } 

}