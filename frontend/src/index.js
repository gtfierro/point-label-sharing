import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import * as serviceWorker from './serviceWorker';

console.log(reducers);

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
