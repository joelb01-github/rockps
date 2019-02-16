import * as ActionTypes from './actionTypes';
import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as utils from '../web3/utils';
import * as Status from '../redux/status';

/* --------------- FINALISE_GAME --------------- */

function* watchFinaliseGame() {
  yield takeEvery(ActionTypes.FINALISE_GAME_REQUEST, finaliseGame);
};

export function* finaliseGame() {
  try { 
    yield put({ 
      type: ActionTypes.UPDATE_STATUS_ACT, 
      payload: Status.ACT.FINAL
    });
    const last = yield call(utils.finaliseGame);
    const status = utils.resetStatus(last);
    yield put({ 
      type: ActionTypes.UPDATE_STATUS, 
      payload: status
    });

    const players = utils.resetPlayers();
    yield put({ 
      type: ActionTypes.UPDATE_PLAYERS, 
      payload: players
    });

  } catch (error) {
    yield put({ type: ActionTypes.STATUS_FAILED, payload: error.message });
  }
}

/* --------------- RESET_GAME --------------- */

function* watchResetGame() {
  yield takeEvery(ActionTypes.RESET_GAME_REQUEST, resetGame);
};

export function* resetGame() {
  try {
    yield put({ 
      type: ActionTypes.UPDATE_STATUS_ACT, 
      payload: Status.ACT.RESET
    });
    yield call(utils.resetGame);
    const status = utils.resetStatus(Status.WINNER.RESET);
    yield put({ 
      type: ActionTypes.UPDATE_STATUS, 
      payload: status
    });
    const players = utils.resetPlayers();
    yield put({ 
      type: ActionTypes.UPDATE_PLAYERS, 
      payload: players
    });  
  } catch (error) {
    yield put({ type: ActionTypes.STATUS_FAILED, payload: error.message });
  }

}

/* --------------- REVEAL_COMMIT --------------- */

function* watchRevealCommit() {
  yield takeEvery(ActionTypes.REVEAL_COMMIT_REQUEST, revealCommit);
}

export function* revealCommit(action) {
  try {
    yield put({ 
      type: ActionTypes.UPDATE_PLAYER_ACT, 
      payload: {
        index: action.payload.index,
        act: Status.ACT.SENDING
      } 
    });
    yield call(utils.revealCommit, action.payload);
    const status = {
      ...action.payload.player,
      act: Status.ACT.SENT,
      status2: Status.ST2.REVEALED
    }
    yield put({ 
      type: ActionTypes.UPDATE_PLAYER, 
      payload: {
        index: action.payload.index,
        status: status
      } 
    });
    // Below not good -- check out how to update canBeFinalised
    const canBeFinalised = utils.canBeFinalised();
    yield put({
      type: ActionTypes.UPDATE_STATUS_FINALISED,
      payload: canBeFinalised
    });
    
  } catch(error) {
    // TODO: divide the above on update status + update players => use existing actions in case of failure
    yield put({ type: ActionTypes.REVEAL_COMMIT_FAILED, payload: error.message });
  }
}

/* --------------- SUBMIT_COMMIT --------------- */

function* watchSubmitCommit() {
  yield takeEvery(ActionTypes.SUBMIT_COMMIT_REQUEST, submitCommit);
}

export function* submitCommit(action) {
  try {
    yield put({ 
      type: ActionTypes.UPDATE_PLAYER_ACT, 
      payload: {
        index: action.payload.index,
        act: Status.ACT.SENDING
      } 
    });
    const addr = yield call(utils.submitCommit, action.payload);
    const status = {
      ...action.payload.player,
      addr: addr,
      act: Status.ACT.SENT,
      status1: Status.ST1.COMMITTED
    }
    yield put({ 
      type: ActionTypes.UPDATE_PLAYER, 
      payload: {
        index: action.payload.index,
        status: status
      } 
    });
    const index2 = (action.payload.index===0) ? 1 : 0;
    yield put({ 
      type: ActionTypes.UPDATE_PLAYER_PL2, 
      payload: {
        index: index2,
        status: Status.ST1.COMMITTED
      } 
    });
    yield put({ type: ActionTypes.UPDATE_STATUS_COUNT });
  } catch (error) {
    yield put({ type: ActionTypes.PLAYERS_FAILED, payload: error.message });
  }

}

/* --------------- FETCH_PLAYER --------------- */

function* watchFetchPlayers() {
  yield takeEvery(ActionTypes.FETCH_PLAYERS_REQUEST, fetchPlayers);
};

export function* fetchPlayers() {
  try {
    const players = yield call(utils.fetchPlayers);
    yield put({ type: ActionTypes.UPDATE_PLAYERS, payload: players });
  } catch (error) {
    yield put({ type: ActionTypes.PLAYERS_FAILED, payload: error.message });
  }

}

/* --------------- FETCH_GAME --------------- */

function* watchFetchGameStatus() {
  yield takeEvery(ActionTypes.FETCH_STATUS_REQUEST, fetchGameStatus);
};

export function* fetchGameStatus() {
  try {    
    const gameStatus = yield call(utils.fetchStatus);
    yield put({ type: ActionTypes.UPDATE_STATUS, payload: gameStatus });
  } catch (error) {
    yield put({ type: ActionTypes.STATUS_FAILED, payload: error.message });
  }

}

/* --------------- SAGA ADMIN --------------- */

export function* rootSaga() {
  yield all([
    watchFinaliseGame(),
    watchResetGame(),
    watchFetchPlayers(),
    watchFetchGameStatus(),
    watchSubmitCommit(),
    watchRevealCommit()
  ]);
};