// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ERC20 토큰 인터페이스
// npm install @openzeppelin/contracts
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TransferToken {
    // ERC20 토큰 컨트랙트 주소
    address public tokenAddress = 0x6299C1C93B03e255E06Ab745C89a31f50ccD2EA1;
    
    // 받는 사람의 어카운트 주소
    address public recipient = 0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79;
    
    uint256 eth = 10**18;
    // 전송할 토큰 양
    uint256 public amount = 1*eth;
    
    function transferTokens() public {
        // ERC20 토큰 인터페이스를 이용하여 토큰 전송
        IERC20 token = IERC20(tokenAddress);
        token.transfer(recipient, amount);
    }

}