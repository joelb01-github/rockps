import { combineReducers } from 'redux';
import { GameStatus } from './statusReducer';
import { Players } from './playersReducer';

const rootReducer = combineReducers({
  gameStatus: GameStatus,
  players: Players
});

export default rootReducer;