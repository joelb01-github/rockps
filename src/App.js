import React, { Component } from 'react';
import './App.css';
import rockps from './contracts/rockps';
import web3 from './web3/web3';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      players: [
        { addr: '...loading', status: '...loading'}, 
        { addr: '...loading', status: '...loading'} ],
      playerCount: 0,
      canBeFinalised: '...loading', // true if 2 players playing
      input0: -1, // to check if problem here
      input1: -1,
      last: '...loading'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  async componentDidMount() {
    const playerCount = parseInt(await rockps.methods.getPlayerCount().call());
    const playerAddr = await rockps.methods.getPlayers().call();
    const getLastest = await rockps.methods.latestWinner().call();

    const last = (getLastest==='0x0000000000000000000000000000000000000000') 
      ? 'game not played yet'
      : getLastest;
    const players = [];
    switch(playerCount) {
      case 0:
        players.push({ addr: 'N/A', status:'has not played yet'});        players.push({ addr: 'N/A', status:'has not played yet'});
        break;
      case 1:
        players.push({ addr: playerAddr[0], status:'has already played'});
        players.push({ addr: 'N/A', status:'has not played yet'});
        break;
      case 2:
        players.push({ addr: playerAddr[0], status:'has already played'});
        players.push({ addr: playerAddr[1], status:'has already played'});
        break;
      default:
    };
    const canBeFinalised = (playerCount === 2) ? 'Yes' : 'No';


    this.setState({ players, playerCount, canBeFinalised, last });
  }

  handleChange = (event, index) => {
    const input = 'input' + index;
    this.setState({
      [input]: event.target.value
    });
  }

  handleValue = (index) => {
    const input = 'input' + index;
    return this.state[input];
  };

  handleSubmit = async (index, event) => {
    event.preventDefault();
    switch(index) {
      case 0:
        this.setState({ 
          players: [
            {...this.state.players[0], status: 'Sending transaction...'}, 
            this.state.players[1] 
          ]
        });
        break;
      case 1:
        this.setState({ 
          players: [  
            this.state.players[0],
            {...this.state.players[1], status: 'Sending transaction...'},
          ]
        });
        break;
      default:
    }
    const accounts = await web3.eth.getAccounts();
    const choice = (index===0) ? this.state.input0 : this.state.input1;
    await rockps.methods.enterAndInput(choice).send({ from: accounts[0] });

    const players = (index===0) 
      ? [ {addr: accounts[0], status: 'Transaction sent!'}, 
        this.state.players[1] ]
      : [this.state.players[0],
        {addr: accounts[0], status: 'Transaction sent!'}, ] ;
    const playerCount = this.state.playerCount + 1;
    const canBeFinalised = (playerCount===2) ? 'Yes' : 'No'

    this.setState({ players, playerCount, canBeFinalised });
  };

  onClikFinal = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ canBeFinalised: 'Fetching winner... '});
    await rockps.methods.finaliseGame().send({ from: accounts[0] });
    const last = await rockps.methods.latestWinner().call();
    this.setState({ 
      players: [
        { addr: 'N/A', status:'has not played yet'}, 
        { addr: 'N/A', status:'has not played yet'} ],
      playerCount: 0,
      canBeFinalised: '...No',
      input0: -1, 
      input1: -1,
      last: last });
  }

  render() {

    const Header = () => {
      return(
        <div>
          <h1>Rock Paper Scissor Game</h1>
          <div>
            <p>Choose for both Alice and Bob (one after the other) what they should play</p>
            <p>When the 2 players have sent their choice (button 'Send choice'), you can finalise the game (button 'Check winner')</p>
          </div>
          <div>
            <h2>Game status</h2>
            <p>Currently <span className='js'>{this.state.playerCount}</span> players have submitted their choice.</p>
            <p>Is the game ready to be finalised? <span className='js'>{this.state.canBeFinalised}</span></p>
            <p>Latest winner: <span className='js'>{this.state.last}</span></p>
            <button onClick={this.onClikFinal}>Check winner</button>
          </div>
          <h2>Let's play...</h2>
        </div>
      );
    }

    const Player = (props) => {
      return(
        <div>
          <h4>{props.name}' side</h4>
          <p>{props.name}' status: <span className='js'>{this.state.players[props.index].status}</span></p>
          <p>Contract used: <span className='js'>{this.state.players[props.index].addr}</span></p>
          <form onSubmit={(event) => this.handleSubmit(props.index, event)}>
            <label>Pick player's choice </label>
            <input type='text' value={this.handleValue(props.index)} onChange={(event) => this.handleChange(event, props.index)}></input>
            <button>Send choice</button>
          </form>
          <h2>{this.state.messageAlice}</h2>
        </div>
      );
    }

    return (
      <div className="App">
        <Header />
        <Player name='Alice' index={0}/>
        <Player name='Bob' index={1}/>
      </div>
    );
  }
}



export default App;
