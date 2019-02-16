import React, { Component } from 'react';
import Player from './PlayerComponent.js';
import Header from './HeaderComponent';
import * as ActionTypes from '../redux/actionTypes';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
  return { 
    players: state.players.players,
    playersIsLoading: state.players.playersIsLoading,
    playersErrMsg: state.players.playersErrMsg 
  };
}

const mapDispactchToProps = dispatch => {
  return {
    fetchPlayers: () => dispatch({ type: ActionTypes.FETCH_PLAYERS_REQUEST })
  };
}

class Main extends Component {

  componentDidMount() {
    this.props.fetchPlayers();
  }

  render() {

    const Players = () => {

      if (this.props.playersIsLoading) {
        return (
          <div className="container">
            <div className="row">
              <Loading />
            </div>
          </div>
        );
      }
    
      else if (this.props.playersErrMsg) {
        return (
          <div className="container">
            <div className="row">
              <h4 className="action">{this.props.playersErrMsg}</h4>
              <p>Refresh this page to load latest game status from Rinkeby and try again</p>
            </div>
          </div>
        );
      }

      else {
        return (
          <div className="row justify-content-center">
            <div className="col-10 col-md-5 m-auto">
              <Player name='Alice' index={0} player={this.props.players[0]} />
            </div>
            <div className="col-10 col-md-5 m-auto">
              <Player name='Bob' index={1} player={this.props.players[1]} />
            </div>
          </div>
        );
      }
    }

    return (
      <div className="container">
        <Header />
        <Players />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispactchToProps)(Main);
