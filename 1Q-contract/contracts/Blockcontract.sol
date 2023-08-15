// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Blockcontract {

    address public owner;

    struct BetInfo {
        uint256 curBlockNumber; // 현재 블록 넘버
        uint256 winBlockNumber; // 맞추려고 하는 정답 블록
        uint256 seed; // 베터가 지정한 시드 넘버 
        bytes32 seedtobyte; // 베터가 지정한 시드넘버를 바이트로 변환
    }

    mapping (uint256 => BetInfo) private _bets;
    uint256 private _index = 0;

    constructor() public {
        owner = msg.sender;
    }

    function calculateSHA256(uint256 value) public pure returns (bytes32) {
        return bytes32(sha256(abi.encodePacked(value)));
    }


    // 베팅 정보 저장
    function SaveBetInfo(uint256 _seed) public returns (bool result) {
        BetInfo memory newBet;
        newBet.curBlockNumber = block.number;
        newBet.winBlockNumber = newBet.curBlockNumber + 5;
        newBet.seed = _seed;
        newBet.seedtobyte = calculateSHA256(_seed);

        _bets[_index] = newBet;
        _index++;
        return true;
    }

    function popInfo(uint256 index) internal returns (bool) {
        delete _bets[index];
        return true;
    }


    function compareBytes(bytes32 a, bytes32 b) internal pure returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < 32; i++) {
            if (a[i] == b[i]) {
                count++;
            }
        }
        return count;
    }

    function OpenWinner() public returns (bytes32, bytes32, uint256) {
        require(_index >= 0, "no bet."); // 추가된 부분

        BetInfo memory b;
        b = _bets[_index];
        bytes32 answerHash = blockhash(b.winBlockNumber);
        uint256 matchingDigits = compareBytes(b.seedtobyte, answerHash);
        popInfo(_index);
        _index--;
        return (answerHash, b.seedtobyte, matchingDigits);
    }

}
