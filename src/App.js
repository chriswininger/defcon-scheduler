import React, { Component } from 'react';
import './App.css';
import Calendar from './components/calendar/calendar'
import EventListDialog from './components/even-list-dialog'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventListVisible: false,
    }
  }
  render() {
    const showEventList = () => {
      this.setState({ eventListVisible:  true})
    }

    return (
      <div className="App">
        <nav className="App-header navbar">
          <h1 className="App-title navbar-brand">
            Defcon 2018 Events (Unofficial)
          </h1>

          <button
              className="btn btn-outline-primary"
              onClick={showEventList}
          >
            Print My Schedule
          </button>
        </nav>
        <main>
          <Calendar/>
          <EventListDialog
              visible={this.state.eventListVisible}
          />
        </main>
      </div>
    );
  }
}

export default App;
