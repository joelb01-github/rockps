pragma solidity >=0.5.0 <0.6.0;

contract Rockps {
    
    // Game to be played by 2 different addresses
    // ROCK = 0; PAPER = 1; SCISSOR = 2
    // WIN = 2; LOOSE = 0; DRAW = 1
    
    struct player {
        address payable owner;
        uint choice;
        bytes32 commit;
        bool hasRevealed;
    }
    player[] players;
    mapping(uint => mapping(uint => uint)) outcomes;
    address payable public latestWinner;
    uint8 public gameCount;
    uint public requiredValue;
    uint public reward;
    address public owner;
    
    // Timer parameters
    uint public timer;
    uint public firstRevealTime;
    
    constructor() public {
        owner = msg.sender;
        requiredValue = 1000; //  wei
        gameCount = 0;
        timer = 180; // seconds
        firstRevealTime = 0;
        
        outcomes[0][0] = 1;
        outcomes[0][1] = 0;
        outcomes[0][2] = 2;
        outcomes[1][0] = 2;
        outcomes[1][1] = 1;
        outcomes[1][2] = 0;
        outcomes[2][0] = 0;
        outcomes[2][1] = 2;
        outcomes[2][2] = 1;
    }
    
    function notAlreadyIn(address candidate) public view returns(bool) {
        bool result = true;
        for (uint i=0; i<players.length; i++) {
            if (players[i].owner == candidate) {
                result = false;
            }
        }
        return result;
    }
    
    function enterCommitment(bytes32 commit) public payable {
        if (msg.value == requiredValue 
        && players.length < 2
        && notAlreadyIn(msg.sender)) {
            player memory newPlayer = player({
                owner: msg.sender,
                commit: commit,
                choice: 3,
                hasRevealed: false
            });
            players.push(newPlayer);
            reward += msg.value;
        }
        else {
            // Reimbourse the player if the input value is not correct
            msg.sender.transfer(msg.value);
        }
    }
    
    function mapAddessToPlayer(address adr) internal view returns(uint8) {
        if(players[0].owner == adr) { return 0; }
        else { return 1; }
    }
    
    function reveal(uint choice, uint nounce) public {
        require(players.length == 2);
        uint8 playerRef = mapAddessToPlayer(msg.sender);
        require(players[playerRef].hasRevealed == false);
        require(keccak256(abi.encodePacked(choice, nounce)) == players[playerRef].commit); 
        
        // 1st reveal
        if (firstRevealTime == 0) {
            firstRevealTime = block.timestamp;
        } else if (block.timestamp - firstRevealTime > timer) {
            assert(false);
        }
        
        players[playerRef].choice = choice;
        players[playerRef].hasRevealed = true;
    }
    
    function getPlayerCount() public view returns(uint256) {
        return players.length;
    }
    
    function getPlayers() public view returns(address[] memory) {
        address[] memory addressList = new address[](players.length);
        for (uint i=0; i<players.length; i++){
            addressList[i] = players[i].owner;
        }
        return addressList;
    }
    
    function getRevealed() public view returns(bool[2] memory) {
        require(players.length == 2);
        return ([players[0].hasRevealed, players[1].hasRevealed]);
    }
    
    function finaliseGame() public {
        require(!notAlreadyIn(msg.sender));
        require(players.length == 2);
        uint toPay = reward;
        
        if (players[0].hasRevealed && players[1].hasRevealed) {
            uint result = outcomes[players[0].choice][players[1].choice];
            if (result == 0) {
                prepareGame(players[1].owner);
                latestWinner.transfer(toPay);
            }
            else if (result == 2) {
                prepareGame(players[0].owner);
                latestWinner.transfer(toPay);
            }
            else {
                address payable player1 = players[0].owner;
                address payable player2 = players[1].owner;
                prepareGame(address(0x0)); 
                player1.transfer(toPay/2);
                player2.transfer(toPay/2);
            }
        } else if (players[0].hasRevealed) {
            require (block.timestamp - firstRevealTime > timer);
            prepareGame(players[0].owner);
            latestWinner.transfer(toPay);
        } else if (players[1].hasRevealed) {
            require (block.timestamp - firstRevealTime > timer);
            prepareGame(players[1].owner);
            latestWinner.transfer(toPay);
        } else {
            assert(false);
        }
    }
    
    function resetGame() public {
        require(msg.sender == owner);
        uint toPay = reward;
        if (players.length == 1){
            address payable player1 = players[0].owner;
            reward = 0;
            delete players;
            player1.transfer(toPay/2);
        } else if (players.length == 2) {
            address payable player1 = players[0].owner;
            address payable player2 = players[1].owner;
            reward = 0;
            delete players;
            player1.transfer(toPay/2);
            player2.transfer(toPay/2);
        }
    }
    
    function prepareGame(address payable winner) internal {
        firstRevealTime = 0;
        latestWinner = winner; 
        gameCount += 1;
        reward = 0;
        delete players;
    }
    
    /********** Admin **********/
    function changeTimer(uint newTimer) public {
        require(msg.sender == owner);
        timer = newTimer;
    }
    
    
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    function getTimeLeft() public view returns(uint) {
        if (block.timestamp < (firstRevealTime + timer)){
            return (firstRevealTime + timer - block.timestamp);
        } else {
            return (0);
        }
    }
}