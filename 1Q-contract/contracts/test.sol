// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ERC20 토큰 인터페이스
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract test {
    // ERC20 토큰 컨트랙트 주소
    address public tokenAddress = 0xa9AFd7A5fA75Ac1CfFeBbCaC3f1Fa430280A6a87;
    
    // 보내는 사람의 어카운트 주소
    address public sender;
    
    // 받는 사람의 어카운트 주소
    address public recipient;
    
    // 전송할 토큰 양
    uint256 public amount;

    // 잔액을 확인할 계좌
    address public balanceaccount = 0xE74B66fCD6d6D9d23474c24EA70Ad71373cD5E79;
    
    function transferTokens() external {
        // ERC20 토큰 인터페이스를 이용하여 토큰 전송
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(sender) >= amount, "fail1");
        require(token.transfer(recipient, amount), "fail2");
    }
    
    function getSenderBalance() external view returns (uint256) {
        // ERC20 토큰 인터페이스를 이용하여 보내는 사람의 토큰 잔액 확인
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(sender);
    }
    
    // 전송할 양 입력
    function setAmount(uint256 _amount) external {
        amount = _amount*(10**18);
    }

    // 전송할 토큰 주소 입력
    function setTokenAddress(address _tokenAddress) external  {
        tokenAddress = _tokenAddress; 
    }

    // 보낼 지갑 주소 입력
    function setSender(address _sender) external  {
        sender = _sender;
    }

    // 받을 주소 입력
    function setRecipient(address _recipient) external  {
        recipient = _recipient;
    }

    // 전송할 양 입력
    function setbalanceaccount(address _balanceaccount) external  {
        balanceaccount = _balanceaccount;
    }


    // 설정한 계좌의 보유 토큰 잔액 확인
    function getBalanceAccount() external view returns (uint256) {
        // ERC20 토큰 인터페이스를 이용하여 설정한 계좌의 토큰 잔액 확인
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(balanceaccount);
    }
}