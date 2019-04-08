import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import OtherPage from "./OtherPage"
import Fib from "./Fib"

class App extends Component {
  render() {
    return (
        <Router>
            <div className="App">
                <header>
                <h1 className="App-title">Fib Calculator v. 2</h1>
                <Link to="/">Home</Link>
                <Link to="/otherpage">Other Page</Link>
                </header>
                <Route exact path="/" component={Fib} />
                <Route path="/otherpage" component={OtherPage} />
            </div>
        </Router>
      
    );
  }
}

export default App;
