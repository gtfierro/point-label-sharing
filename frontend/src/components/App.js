import React, {
  Component
} from 'react';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';
import './css/App.css';
import Dashboard from './Dashboard';


class App extends Component {
  render() {
      
      return ( <BrowserRouter>
        <div className = "App">
          <Route exact path = "/" component = {Dashboard} />
        </div> 
        </BrowserRouter>
      );
  }


}

export default App;