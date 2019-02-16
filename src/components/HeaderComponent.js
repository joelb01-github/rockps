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
      <h1 className="display-3">Rock Paper Scissor</h1>
      <hr className="my-2" />
    </div>
  );
}

const Instructions = () => {
  return (
    <div>
      <h4>Instructions</h4>
      <p>Have Metamask installed (change account for each player)</p>
      <p>1) Commit 2) Reveal 3) Finish</p>
    </div>
  );
}

export default Header;