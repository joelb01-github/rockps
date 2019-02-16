import React from 'react';
import { Jumbotron } from 'reactstrap';
import GameStatus from './GameStatusComponent';

const Header = () => {
  return(
    <Jumbotron>
      <Intro />
      <GameStatus />
      <Instructions />
    </Jumbotron>
  );
}

const Intro = () => {
  return (
    <div>
      <div>
        <h1 className="display-3">Rock Paper Scissor</h1>
        <p className="lead">This is a simple rock paper scissor game that uses Ethereum's Rinkeby network. You should have metamask installed and configured on Rinkeby.</p>
      </div>
      <hr className="my-2" />
    </div>
  );
}

const Instructions = () => {
  return (
    <div>
      <h4>Instructions</h4>
      <p>Choose for both Alice and Bob (one after the other) what they should play.</p>
      <p>When the 2 players have sent their choice (button 'Send choice'), you can finalise the game (button 'Check winner' will appear).</p>
    </div>
  );
}

export default Header;