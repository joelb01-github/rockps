import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './actionCreators';
import rootReducer from './rootReducer';
import logger from 'redux-logger';

export const configureStore = () => {

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer, 
    compose(
      applyMiddleware(
        logger,
        sagaMiddleware )
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
};