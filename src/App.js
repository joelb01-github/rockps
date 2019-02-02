import React, { Component } from 'react';
import './App.css';
import rockps from './contracts/rockps';
import web3 from './web3/web3';
class App extends Component {

  state = {
    players: [{
      name: 'Alice',
      status: '...loading',
      choice: 0
    }, {
      name: 'Bob',
      status: '...loading',
      choice: 0
    }],
    playerCount: 0,
    canBeFinalised: '...loading', // true if 2 players playing
  };

  async componentDidMount() {
    const playerCount = await rockps.methods.getPlayerCount().call();
    const hasAlicePlayed = await (rockps.methods.hasPlayed(1).call()) 
      ? 'has already played'
      :'has not played yet';
    const hasBobPlayed = await (rockps.methods.hasPlayed(2).call()) 
      ? 'has already played'
      :'has not played yet';
    const canBeFinalised = 'no';
    if (playerCount === 2) {
      canBeFinalised = 'yes';
    }

    this.setState({
      playerCount, 
      canBeFinalised,
      players: [{...this.state.players[0],
        status: hasAlicePlayed
      }, {...this.state.players[1],
        status: hasBobPlayed
      }]
    });
  }

  handleChangeAlice = (event) => {
    this.setState({
      players: [
        {...this.state.players[0], choice: event.target.value},
        {...this.state.players[1]}
      ]
    });
  }

  handleChangeBob = (event) => {
    this.setState({
      players: [
        {...this.state.players[0]},
        {...this.state.players[1], choice: event.target.value}
      ]
    });
  }

  onClickAlice = async (event) => {
    event.preventDefault();
    this.setState({ 
      players: [
        {...this.state.players[0], status: 'Sending transaction...'}, 
        this.state.players[1] 
      ]
    });
    const accounts = await web3.eth.getAccounts();
    await rockps.methods.enterAndInput(
      this.state.players[0].choice,
      1 // Alice
    ).send({ from: accounts[0] });
    this.setState({ 
      players: [
        {...this.state.players[0], status: 'Transaction sent!'}, 
        this.state.players[1] 
      ],
      playerCount: (parseInt(this.state.playerCount) + 1),
      canBeFinalised: (this.state.canBeFinalised===2) ? 'Yes' : 'No'
    });
  };

  onClickBob = async (event) => {
    event.preventDefault();
    this.setState({ 
      players: [ 
        this.state.players[0],
        {...this.state.players[1], status: 'Sending transaction...'}
      ]
    });
    const accounts = await web3.eth.getAccounts();
    await rockps.methods.enterAndInput(
      this.state.players[1].choice,
      2 // Bob
    ).send({ from: accounts[0] });
    this.setState({ 
      players: [ 
        this.state.players[0],
        {...this.state.players[1], status: 'Transaction sent!'}
      ],
      playerCount: parseInt(this.state.playerCount) + 1,
      canBeFinalised: (this.state.canBeFinalised===2) ? 'Yes' : 'No'
    });
  };

  onClikFinal = async () => {
    // TODO: change latestWinner in smart contract to be a uint (1 Alice, 2 Bob, 0 neutral)
  }

  render() {
    return (
      <div className="App">
        <h1>Rock Paper Scissor Game</h1>
        <div>
          <h2>Game status</h2>
          <p>Currently <span className='js'>{this.state.playerCount}</span> players submitted their choice.</p>
          <p>It the game ready to be finalised? <span className='js'>{this.state.canBeFinalised}</span></p>
          <button onClick={this.onClikFinal}>Finalise round</button>
          <h4>Instructions</h4>
          <p>Choose for both Alice and Bob what they should play</p>
          <p>When the 2 players have picked their choice and validated it (though the corresponding button), you can finalise the game</p>
        </div>
        <div>
          <h2>Let's play...</h2>
          <h4>Alice' side</h4>
          <p>Alice' status: <span className='js'>{this.state.players[0].status}</span></p>
          {/* <p>Alice's choice: {this.state.players[0].choice}</p> */}
          <form onSubmit={this.onClickAlice}>
            <label>Pick Alice's choice </label>
            <input type='text' value={this.state.players[0].choice} onChange={this.handleChangeAlice}></input>
            <button>Send choice</button>
          </form>
          <h2>{this.state.messageAlice}</h2>
        </div>
        <div>
          <h4>Bob' side</h4>
          <p>Bob' status: <span className='js'>{this.state.players[1].status}</span></p>
          {/* <p>Bob's choice: {this.state.players[1].choice}</p> */}
          <form onSubmit={this.onClickBob}>
            <label>Pick Bob's choice </label>
            <input type='text' value={this.state.players[1].choice} onChange={this.handleChangeBob}></input>
            <button>Send choice</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
