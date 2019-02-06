import React, { Component } from 'react';
import './App.css';
import rockps from './contracts/rockps';
import web3 from './web3/web3';
import { Jumbotron, Button, Card, CardHeader, CardBody, CardText, CardFooter, Form, FormGroup, Label, Input,  } from 'reactstrap';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      players: [
        { addr: '...loading', status: '...loading'}, 
        { addr: '...loading', status: '...loading'} ],
      playerCount: 0,
      canBeFinalised: '...loading', // true if 2 players playing
      input0: 0, 
      input1: 0,
      last: '...loading'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleFinalSubmit = this.handleFinalSubmit.bind(this);
    this.newGame = this.newGame.bind(this);
  };

  async componentDidMount() {
    const playerCount = parseInt(await rockps.methods.getPlayerCount().call());
    const playerAddr = await rockps.methods.getPlayers().call();
    const getLastest = await rockps.methods.latestWinner().call();
    let gameCount = parseInt(await rockps.methods.gameCount().call());

    let last = 'game not played yet';
    if (gameCount !== 0) { 
      (getLastest === '0x0000000000000000000000000000000000000000') 
        ? last = 'draw'
        : last = getLastest ;
    };
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
  };

  newGame = (last) => {
    this.setState({
      players: [
        { addr: 'N/A', status: 'has not played yet'}, 
        { addr: 'N/A', status: 'has not played yet'} ],
      playerCount: 0,
      canBeFinalised: 'No',
      input0: 0,
      input1: 0,
      last: last
    });
  };

  handleChange = (event, index) => {
    const input = 'input' + index;
    this.setState({ [input]: event.target.value });
  };

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
    };
    const accounts = await web3.eth.getAccounts();
    const choice = (index===0) ? this.state.input0 : this.state.input1;
    await rockps.methods.enterAndInput(choice).send({ from: accounts[0] });

    const players = (index===0) 
      ? [ {addr: accounts[0], status: 'Transaction sent!'}, 
        this.state.players[1] ]
      : [this.state.players[0],
        {addr: accounts[0], status: 'Transaction sent!'}, ] ;
    const playerCount = this.state.playerCount + 1;
    const canBeFinalised = (playerCount===2) ? 'Yes' : 'No';

    this.setState({ players, playerCount, canBeFinalised });
  };

  handleFinalSubmit = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ canBeFinalised: 'Fetching winner... '});
    await rockps.methods.finaliseGame().send({ from: accounts[0] });
    const last = await rockps.methods.latestWinner().call();

    (last === '0x0000000000000000000000000000000000000000')
      ? this.newGame('draw')
      : this.newGame(last);
  };

  render() {

    const Header = () => {
      return(
        <div>
        <Jumbotron>
          <h1 className="display-3">Rock Paper Scissor</h1>
          <p className="lead">This is a simple rock paper scissor game that uses Ethereum's Rinkeby network. You should have metamask installed and configured on Rinkeby.</p>
          <hr className="my-2" />
          <h4>Game status</h4>
            <p>Currently <span className='js'>{this.state.playerCount}</span> players have submitted their choice.</p>
            <p>Is the game ready to be finalised? <span className='js'>{this.state.canBeFinalised}</span></p>
          <p className="lead">
            <Button color="primary" onClick={this.handleFinalSubmit}>Check winner</Button>
          </p>
          <hr className="my-2" />
            <h4>Instructions</h4>
            <p>Choose for both Alice and Bob (one after the other) what they should play</p>
            <p>When the 2 players have sent their choice (button 'Send choice'), you can finalise the game (button 'Check winner')</p>
        </Jumbotron>
        </div>
      );
    }

    const Player = (props) => {
      return(
        <div>
          <Card>
            <CardHeader tag="h4">{props.name}' side</CardHeader>
            <CardBody>
              <CardText>{props.name}' status: <span className='js'>{this.state.players[props.index].status}</span></CardText>
              <CardText>Contract used: <span className='js'>{this.state.players[props.index].addr}</span></CardText>
              <Form onSubmit={(event) => this.handleSubmit(props.index, event)}>
                <FormGroup>
                  <Label for="choice">Pick player's choice</Label>
                  <Input type="select" id="choice" name="choice" 
                  value={this.handleValue(props.index)} 
                  onChange={(event) => this.handleChange(event, props.index)}>
                    <option value="0">Rock</option>
                    <option value="1">Paper</option>
                    <option value="2">Scissor</option>
                  </Input>
                </FormGroup>
                <Button>Submit</Button>
              </Form>
            </CardBody>
            <CardFooter className="text-muted">Something...</CardFooter>
          </Card>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="container">
          <Header />
          <div className="row justify-content-center">
            <div className="col-10 col-md-5 m-auto">
              <Player name='Alice' index={0}/>
            </div>
            <div className="col-10 col-md-5 m-auto">
              <Player name='Bob' index={1}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



export default App;
