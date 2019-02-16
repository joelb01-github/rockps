import * as ActionTypes from './actionTypes';

export const Players = (state = {
  playersIsLoading: true,
  playersErrMsg: null,
  players: []
}, action) => {
  switch(action.type) {

    case ActionTypes.FETCH_PLAYERS_REQUEST:
      return {...state,
        playersIsLoading: true, 
        playersErrMsg: null,
        players: []
      };

    case ActionTypes.PLAYERS_FAILED:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: action.payload,
        players: []
      };

    case ActionTypes.UPDATE_PLAYERS:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: action.payload
      };

    case ActionTypes.UPDATE_PLAYER:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: subPlayers(state.players, action)
      };

    case ActionTypes.UPDATE_PLAYER_ACT:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: subPlayers(state.players, action)
      };

    case ActionTypes.UPDATE_PLAYER_ST1:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: subPlayers(state.players, action)
      };

    case ActionTypes.UPDATE_PLAYER_ST2:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: subPlayers(state.players, action)
      };

    case ActionTypes.UPDATE_PLAYER_ADDR:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: subPlayers(state.players, action)
      };

    case ActionTypes.UPDATE_PLAYER_PL2:
      return {...state,
        playersIsLoading: false,
        playersErrMsg: null,
        players: subPlayers(state.players, action)
      };

    default:
      return state;
  }
}

const subPlayers = (state, action) => {
  switch(action.type) {

    case ActionTypes.UPDATE_PLAYER:
      switch(action.payload.index) {
        case 0:
          return [action.payload.status, state[1]];
        case 1:
          return [state[0], action.payload.status];
        default:
          return state;
      }

    case ActionTypes.UPDATE_PLAYER_ACT:
      switch(action.payload.index) {
        case 0:
          return [
            {...state[0], act: action.payload.act }, 
            state[1] 
          ];
        case 1:
          return [ 
            state[0],
            {...state[1], act: action.payload.act }, 
          ];
        case 2:
          return [ 
            {...state[0], act: action.payload.act },
            {...state[1], act: action.payload.act }, 
          ];
        default:
          return state;
      }
    
    case ActionTypes.UPDATE_PLAYER_ST1:
      switch(action.payload.index) {
        case 0:
          return [
            {...state[0], status1: action.payload.status1 }, 
            state[1] 
          ];
        case 1:
          return [ 
            state[0],
            {...state[1], status1: action.payload.status1 }, 
          ];
        default:
          return state;
      }
  
      case ActionTypes.UPDATE_PLAYER_ST2:
        switch(action.payload.index) {
          case 0:
            return [
              {...state[0], status2: action.payload.status2 }, 
              state[1] 
            ];
          case 1:
            return [ 
              state[0],
              {...state[1], status2: action.payload.status2 }, 
            ];
          default:
            return state;
        }
  
      case ActionTypes.UPDATE_PLAYER_ADDR:
        switch(action.payload.index) {
          case 0:
            return [
              {...state[0], addr: action.payload.addr }, 
              state[1] 
            ];
          case 1:
            return [ 
              state[0],
              {...state[1], addr: action.payload.addr }, 
            ];
          default:
            return state;
        }
  
      case ActionTypes.UPDATE_PLAYER_PL2:
        switch(action.payload.index) {
          case 0:
            return [
              {...state[0], pl2status1: action.payload.status }, 
              state[1] 
            ];
          case 1:
            return [ 
              state[0],
              {...state[1], pl2status1: action.payload.status }, 
            ];
          default:
            return state;
        }

    default:
      return state;
  }
}