import * as ActionTypes from './actionTypes';

export const GameStatus = (state = {
  gameIsLoading: true,
  gameErrMsg: null,
  status: null
}, action) => {
  switch(action.type) {

    case ActionTypes.FETCH_STATUS_REQUEST:
      return {...state,
        gameIsLoading: true, 
        gameErrMsg: null,
        status: null
      };

    case ActionTypes.UPDATE_STATUS:
      return {...state,
        gameIsLoading: false,
        gameErrMsg: null,
        status: action.payload
      };

    case ActionTypes.STATUS_FAILED:
      return {...state,
        gameIsLoading: false,
        gameErrMsg: action.payload,
        status: null
      };

    case ActionTypes.UPDATE_STATUS_COUNT:
      return {...state,
        gameIsLoading: false,
        gameErrMsg: null,
        status: {...state.status,
          playerCount: state.status.playerCount+1}
      };

    case ActionTypes.UPDATE_STATUS_FINALISED:
      return {...state,
        gameIsLoading: false,
        gameErrMsg: null,
        status: {...state.status,
          canBeFinalised: action.payload}
      };

    case ActionTypes.UPDATE_STATUS_ACT:
      return {...state,
        gameIsLoading: false,
        gameErrMsg: null,
        status: {...state.status,
          act: action.payload}
      };

    default:
      return state;
  }
}