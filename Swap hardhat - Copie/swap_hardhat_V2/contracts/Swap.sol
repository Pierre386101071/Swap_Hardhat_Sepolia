// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Owner {
    address owner;
    constructor(){
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner, "Not the owner");
        _;

    }
}

contract Swap is Owner {


    struct Token {
        string name;
        uint price;
    }
    event LiquidityAdded(address _addressToken, uint _amount );
    event TokenAdded (address _addressToken);
    event Swapped(address _user ,address _addressTokenFrom,address _addressTokenTo, uint _amount);

    mapping(address => Token) tokens;

    function getSwapRate(address _addressFrom ,address _addressTo) public view returns(uint){
        uint rate = 1e18 * tokens[_addressTo].price / tokens[_addressFrom].price;
        return rate;
    }

    function getLiquidity(address _addressToken) public view returns (uint){
         return IERC20(_addressToken).balanceOf(address(this));
    }  

    function addToken(address _addressToken, uint _price, string memory _name) onlyOwner external {
        tokens[_addressToken].price = _price;
        tokens[_addressToken].name = _name;
        emit TokenAdded(_addressToken);
    }

    function addLiquidity(address _addressToken , uint _amount) onlyOwner external payable{
        require(_addressToken != address(0), "Invalid token address");
        require(tokens[_addressToken].price != 0, "Token not registered");
        require (IERC20(_addressToken).allowance(msg.sender , address(this)) >= _amount, "Must approve tokens" );
        IERC20(_addressToken).transferFrom(owner , address(this), _amount);
        emit LiquidityAdded(_addressToken , _amount);
    }
      
    function swap(address _addressFrom , address _addressTo, uint _amount) external payable {
        require (IERC20(_addressFrom).balanceOf(msg.sender) >= _amount);
        require (_amount > 0, "Must swap a positive amount of tokens");
        require ( tokens[_addressFrom].price !=0  ,"This token is not supported" );
        require (IERC20(_addressFrom).allowance(msg.sender , address(this)) >= _amount, "Must approve tokens" );
        uint rate = getSwapRate(_addressFrom , _addressTo);
        require ( IERC20(_addressTo).balanceOf(address(this)) >= _amount*rate/1e18 ,"Not enough liquidity" );
        IERC20(_addressFrom).transferFrom(msg.sender, address(this) , _amount);
        IERC20(_addressTo).transfer( msg.sender ,_amount * (rate/1e18));
        emit Swapped(msg.sender ,_addressFrom, _addressTo, _amount);
    }
}