import React, { Component } from 'react';
import './App.css';
import rockps from './contracts/rockps';
import web3 from './web3/web3';
import { Jumbotron, Button, Card, CardHeader, CardBody, CardText, CardFooter, Form, FormGroup, Label, Input } from 'reactstrap';

const NOT_PLAYED = 'Has not played yet';
const PLAYED = 'Has already played';
const SENDING = 'Sending transaction...';
const SENT = 'Transaction sent!';

const LOADING = '...loading';

const YES = 'Yes';
const NO = 'No';
const NA = 'N/A';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      players: [
        { addr: LOADING, status: LOADING, playing: LOADING}, 
        { addr: LOADING, status: LOADING, playing: LOADING} ],
      playerCount: 0,
      canBeFinalised: LOADING,
      input0: 0, 
      input1: 0,
      last: LOADING
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
        players.push({ addr: NA, status: NOT_PLAYED, playing: YES });
        players.push({ addr: NA, status: NOT_PLAYED, playing: NO });
        break;
      case 1:
        players.push({ addr: playerAddr[0], status: PLAYED, playing: NO });
        players.push({ addr: NA, status: NOT_PLAYED, playing: YES });
        break;
      case 2:
        players.push({ addr: playerAddr[0], status: PLAYED, playing: NO });
        players.push({ addr: playerAddr[1], status: PLAYED, playing: NO });
        break;
      default:
    };
    const canBeFinalised = (playerCount === 2) ? YES : NO;

    this.setState({ players, playerCount, canBeFinalised, last });
  };

  newGame = (last) => {
    this.setState({
      players: [
        { addr: NA, status: NOT_PLAYED, playing: YES }, 
        { addr: NA, status: NOT_PLAYED, playing: NO } ],
      playerCount: 0,
      canBeFinalised: NO,
      input0: 0,
      input1: 0,
      last: last
    });
  };

  indexToInput = (index) => { return 'input' + index; }

  handleChange = (event, index) => { this.setState({ [this.indexToInput(index)]: event.target.value }); };

  handleValue = (index) => { return this.state[this.indexToInput(index)]; };

  handleSubmit = async (index, event) => {
    event.preventDefault();
    switch(index) {
      case 0:
        this.setState({ 
          players: [
            {...this.state.players[0], status: SENDING}, 
            this.state.players[1] 
          ]
        });
        break;
      case 1:
        this.setState({ 
          players: [  
            this.state.players[0],
            {...this.state.players[1], status: SENDING},
          ]
        });
        break;
      default:
    };
    const accounts = await web3.eth.getAccounts();
    const choice = (index===0) ? this.state.input0 : this.state.input1;
    await rockps.methods.enterAndInput(choice).send({ from: accounts[0] });

    const players = (index===0) 
      ? [ {addr: accounts[0], status: SENT, playing: NO} , 
        {...this.state.players[1], playing: YES} ]
      : [this.state.players[0],
        {addr: accounts[0], status: SENT, playing: NO }, ] ;
    const playerCount = this.state.playerCount + 1;
    const canBeFinalised = (playerCount===2) ? YES : NO;

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

    const FinaliseButton = () => {
      if (this.state.canBeFinalised === YES) {
        return (
          <p className="lead">
            <Button color="primary" onClick={this.handleFinalSubmit}>Check winner</Button>
          </p>
        );
      }
      else { return( <div /> )}
    };
    
    const ChoiceForm = (props) => {
      return(
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
      );
    };

    const Status = (props) => {
      if (props.player.status === PLAYED || props.player.status === SENT) {
        return(
          <>
            <CardText>{props.player.status}</CardText>
            <CardText>Contract used: <span className='js'>{props.player.addr}</span></CardText>
          </>
        );
      }
      else {
        return (<div></div>);
      }
    };
    
    const ShowAction = (props) => {
      if (props.player.status === SENDING || 
        props.player.status === SENT ||
        props.player.status === LOADING) {
          return (<> {props.player.status} </>);
        }
      else {
        return (<> </>);
      }
    };

    const Player = (props) => {
      let color;
    
      if (props.player.playing === YES) {
        color = 'primary';
        return (
          <Card outline color={color}>
            <CardHeader tag="h4">{props.name}' side</CardHeader>
            <CardBody>
              <ChoiceForm index={props.index}/>
            </CardBody>
            <CardFooter className="text-muted">
              <ShowAction
                index={props.index} 
                player={props.player} />
            </CardFooter>
          </Card>
        );
      }
      else {
        color = 'secondary';
        return (
          <Card outline color={color}>
            <CardHeader tag="h4">{props.name}' side</CardHeader>
            <CardBody>
              <Status 
                index={props.index} 
                player={props.player}
                name={props.name} />
            </CardBody>
            <CardFooter className="text-muted">
              <ShowAction 
                index={props.index} 
                player={props.player} />
            </CardFooter>
          </Card>
        );
      }
    };

    const Header = () => {
      return(
        <Jumbotron>
          <div>
            <h1 className="display-3">Rock Paper Scissor</h1>
            <p className="lead">This is a simple rock paper scissor game that uses Ethereum's Rinkeby network. You should have metamask installed and configured on Rinkeby.</p>
          </div>
          <hr className="my-2" />
          <div>
            <h4>Game status</h4>
            <p>Currently <span className='js'>{this.state.playerCount}</span> players have submitted their choice (2 needed to finalise the round).</p>
            <p>Last game winner: {this.state.last}</p>
            <FinaliseButton />
          </div>
          <hr className="my-2" />
          <div>
            <h4>Instructions</h4>
            <p>Choose for both Alice and Bob (one after the other) what they should play.</p>
            <p>When the 2 players have sent their choice (button 'Send choice'), you can finalise the game (button 'Check winner' will appear).</p>
          </div>
        </Jumbotron>
      );
    };

    return (
      <div className="App">
        <div className="container">
          <Header />
          <div className="row justify-content-center">
            <div className="col-10 col-md-5 m-auto">
              <Player 
                name='Alice' 
                index={0}
                player={this.state.players[0]}/>
            </div>
            <div className="col-10 col-md-5 m-auto">
              <Player 
                name='Bob' 
                index={1} 
                player={this.state.players[1]}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
