// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Agenda {
    uint256 ID;
    string TITLE; // 제목
    string AGENDA_TYPE; // 안건 유형
    uint256 START_DATE; // TIMESTAMP
    uint256 END_DATE; // TIMESTAMP
    uint256 WINNERS_COUNT; // 당첨자 수
    uint256 TARGET_AUDIENCE; // 대상 인원
    uint256 CREATED_BY; // 생성자
    uint256 CREATED_DATE; // 생성일
    address[] LAST_MODIFIED_BY; // 수정자
    uint256[] MODIFIED_DATE; // 수정일
    uint256 PARTICIPATING_INDIVIDUALS; // 참여인원
    address Owner;



    function updateTitle(string memory _newTitle) public {
        TITLE = _newTitle;
    }

    function updateStartDate(uint256 _newStartDate) public {
        START_DATE = _newStartDate;
    }

    function updateEndDate(uint256 _newEndDate) public {
        START_DATE = _newEndDate;
    }

    function updateWinnerCnt(uint256 _newWCnt) public {
        WINNERS_COUNT = _newWCnt;
    }   

    function ModifiedInfo(uint256 _ModifiedDate) public {
        LAST_MODIFIED_BY.push(msg.sender);
        MODIFIED_DATE.push(_ModifiedDate);
    }

}