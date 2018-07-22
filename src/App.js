import React, { Component } from 'react';
import './App.css';
import Calendar from './components/calendar/calendar'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Defcon 2018 Events</h1>
        </header>
        <main>
          <Calendar/>
        </main>
      </div>
    );
  }
}

export default App;
