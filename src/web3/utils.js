import rockps from '../contracts/rockps';
import web3 from './web3';
import * as Status from '../redux/status';

export const fetchPlayers = async () => {
  const playerCount = parseInt(await rockps.methods.getPlayerCount().call());
  const playerAddr = await rockps.methods.getPlayers().call();

  const players = [];
  switch(playerCount) {
    case 0:
      players.push({ 
        addr: Status.NA, // player's address
        status1: Status.ST1.NOT_COMMITTED, // player's commit status
        pl2status1: Status.ST1.NOT_COMMITTED, // other player's reveal status
        status2: Status.ST2.NOT_REVEALED, // player's reveal status
        act: Status.ACT.NONE // player's ongoing actions
      });
      players.push({ addr: Status.NA, status1: Status.ST1.NOT_COMMITTED, pl2status1: Status.ST1.NOT_COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
      break;
    case 1:
      players.push({ addr: playerAddr[0], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.NOT_COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
      players.push({ addr: Status.NA, status1: Status.ST1.NOT_COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
      break;
    case 2:
      const hasRevealed = await rockps.methods.getRevealed().call();
      if (hasRevealed[0] && hasRevealed[1]) {
        players.push({ addr: playerAddr[0], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.REVEALED, act: Status.ACT.NONE });
        players.push({ addr: playerAddr[1], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.REVEALED, act: Status.ACT.NONE });
      }
      else if (!hasRevealed[0] && !hasRevealed[1]) {
        players.push({ addr: playerAddr[0], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
        players.push({ addr: playerAddr[1], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
      }
      else {
        if (hasRevealed[0]) {
          players.push({ addr: playerAddr[0], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.REVEALED, act: Status.ACT.NONE});
          players.push({ addr: playerAddr[1], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
        }
        else {
          players.push({ addr: playerAddr[0], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.NOT_REVEALED, act: Status.ACT.NONE });
          players.push({ addr: playerAddr[1], status1: Status.ST1.COMMITTED, pl2status1: Status.ST1.COMMITTED, status2: Status.ST2.REVEALED, act: Status.ACT.NONE });
        }
      }
      break;
    default:
  };
  return(players);
};

export const submitCommit = async (payload) => {
  const accounts = await web3.eth.getAccounts();
  const playerCountBef = parseInt(await rockps.methods.getPlayerCount().call());
  const choice = payload.choice;
  const nounce = payload.nounce;

  const commit = web3.utils.soliditySha3(choice, nounce);
  // TODO: add address in the commit?

  await rockps.methods.enterCommitment(commit).send({ 
    from: accounts[0],
    value: 1000 
  });
  const playerCountAft = parseInt(await rockps.methods.getPlayerCount().call());
  
  if (playerCountAft === playerCountBef+1) {
    return accounts[0];
  }
  else {
    throw new Error('Player did not successfully commit');
  }
};

export const revealCommit = async (payload) => {
  const accounts = await web3.eth.getAccounts();
  const choice = payload.choice;
  const nounce = payload.nounce;

  await rockps.methods.reveal(choice,nounce).send({ from: accounts[0] });
};

export const fetchStatus = async () => {
    
  const getLastest = await rockps.methods.latestWinner().call();
  let gameCount = parseInt(await rockps.methods.gameCount().call());
  let last = Status.WINNER.NOT_PLAYED;
  if (gameCount !== 0) { 
    last = (getLastest === Status.WINNER.NEUTRAL) 
      ? Status.WINNER.DRAW
      : getLastest;
  };

  const playerCount = parseInt(await rockps.methods.getPlayerCount().call());

  let canBeFinalised = false;
  const playerAddr = await rockps.methods.getPlayers().call();
  if (playerAddr.length === 2) {
    const hasRevealed = await rockps.methods.getRevealed().call();
    if (hasRevealed[0] && hasRevealed[1]) {
      canBeFinalised = true;
    }
  }

  return({
    canBeFinalised: canBeFinalised,
    playerCount: playerCount,
    last: last,
    act: Status.ACT.NONE
  });
};

export const resetPlayers = () => {
  return [
    { addr: Status.NA, 
      status1: Status.ST1.NOT_COMMITTED, 
      pl2status1: Status.ST1.NOT_COMMITTED, 
      status2: Status.ST2.NOT_REVEALED, 
      act: Status.ACT.NONE },
    { addr: Status.NA, 
      status1: Status.ST1.NOT_COMMITTED, 
      pl2status1: Status.ST1.NOT_COMMITTED, 
      status2: Status.ST2.NOT_REVEALED, 
      act: Status.ACT.NONE }
  ];
};

export const resetStatus = (last) => {
  return ({
    playerCount: 0,
    canBeFinalised: Status.NO,
    last: last,
    act: Status.ACT.NONE
  });
};

export const canBeFinalised = () => {

};

export const finaliseGame = async () => {
  const accounts = await web3.eth.getAccounts();
  await rockps.methods.finaliseGame().send({ from: accounts[0] });

  const last = await rockps.methods.latestWinner().call();
  return (last === Status.WINNER.NEUTRAL)
    ? Status.WINNER.DRAW
    : last;
};

export const resetGame = async () => {
  const accounts = await web3.eth.getAccounts();
  await rockps.methods.resetGame().send({ from: accounts[0] });
};