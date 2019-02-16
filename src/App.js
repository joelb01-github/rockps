import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Main from './components/MainComponent';
import { configureStore } from './redux/configureStore';
import { Provider } from 'react-redux';
import './App.css';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Main />
        </div>
      </Provider>
    );
  }
}

export default App;

App.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object,
  Main: PropTypes.element
}