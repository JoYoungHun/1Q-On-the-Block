// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Blockcontract {

    struct BetInfo {
        uint256 curBlockNumber; // 현재 블록 넘버
        uint256 winBlockNumber; // 맞추려고 하는 정답 블록
        address bettor; // 베터의 주소
        uint256 seed; // 베터가 지정한 시드 넘버 
        bytes32 seedtobyte; // 베터가 지정한 시드넘버를 바이트로 변환
    }

    function calculateSHA256(uint256 value) internal pure returns (bytes32) {
        return bytes32(sha256(abi.encodePacked(value)));
    }

    function SaveBetInfo(uint256 _winBlockNumber, uint256 _seed) public {
        BetInfo memory newBet;
        newBet.curBlockNumber = block.number;
        newBet.winBlockNumber = newBet.curBlockNumber + 5;
        newBet.bettor = msg.sender;
        newBet.seed = _seed;
        newBet.seedtobyte = calculateSHA256(_seed);
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

    function OpenWinner(BetInfo memory newBet) public view returns (bytes32, bytes32, uint256) {
        bytes32 answerHash = blockhash(newBet.winBlockNumber);
        uint256 matchingDigits = compareBytes(newBet.seedtobyte, answerHash);
        return (answerHash, newBet.seedtobyte, matchingDigits);
    }
}
