import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ActionTypes from '../redux/actionTypes';
import * as Status from '../redux/status';
import { Button } from 'reactstrap';
import { rockpsAddress } from '../contracts/rockps';

const mapStateToProps = state => {
  return {
    status: state.gameStatus.status,
    gameIsLoading: state.gameStatus.gameIsLoading,
    gameErrMsg: state.gameStatus.gameErrMsg,
    players: state.players.players,
    playersIsLoading: state.players.playersIsLoading,
    playersErrMsg: state.players.playersErrMsg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    finaliseGame: () => dispatch({ type: ActionTypes.FINALISE_GAME_REQUEST }),
    resetGame: () => dispatch({ type: ActionTypes.RESET_GAME_REQUEST }),
    fetchGameStatus: () => dispatch({ type: ActionTypes.FETCH_STATUS_REQUEST })
  };
};

class GameStatus extends Component {

  componentDidMount() { this.props.fetchGameStatus(); }
  handleFinalSubmit = () => this.props.finaliseGame();
  handleReset = () => this.props.resetGame();

  render() {

    const Finalise = () => {
      if (this.props.players[0].status2 === Status.ST2.REVEALED
        && this.props.players[1].status2 === Status.ST2.REVEALED) {
        return (
          <p className="lead">
            <Button color="primary" onClick={() => this.handleFinalSubmit()}>Check winner</Button> </p>
        );
      }
      else { return( <div /> )}
    };

    const Reset = () => {
      return (
        <p className="lead">
          <Button color="primary" onClick={() => this.handleReset()}>Reset Game</Button> </p>
      );
    };

    const Controls = () => {
      if (this.props.playersIsLoading) {
        return ( <p className="action">Loading players status...</p> );
      }
      else if (this.props.status.act !== Status.ACT.NONE) {
        return( <p className="action">{this.props.status.act}</p> );
      }
      else {
        return ( <div> <Finalise /> <Reset /> </div> );
      }
    }
    
    if (this.props.gameIsLoading) {
      return (
        <div>
          <div>
            <h4>Game status</h4>
            <p className="action">Loading game status...</p>
          </div>
          <hr className="my-2" />
        </div>
      );
    }
    
    else if (this.props.gameErrMsg) {
      return (
        <div>
          <div>
            <h4>Game status</h4>
            <p className="action">{this.props.gameErrMsg}</p>
            <p className="action">Reload this page to get latest status and try again...</p>
          </div>
          <hr className="my-2" />
        </div>
      );
    }
    
    else if (this.props.playersErrMsg) {
      return ( <div> <p className="action">Error...</p> </div> );
    }

    else {
      return(
        <div>
          <div>
            <h4>Game status</h4>
            <p>Contract deployed on Rinkeby at: {rockpsAddress}</p>
            <p>Last game winner: {this.props.status.last}</p>
            <p>Currently {this.props.status.playerCount} players have committed their choice.</p>
            <Controls />
          </div>
          <hr className="my-2" />
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameStatus);