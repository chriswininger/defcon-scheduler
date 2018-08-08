import React, { Component } from 'react';
import './App.css';
import Calendar from './components/calendar/calendar'
import EventListDialog from './components/even-list-dialog'
import axios from "axios";
import {genTalkID, setTalkSelectedByID} from "./utils/utils";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventListVisible: false,
      talks: []
    }
  }

  componentDidMount() {
      axios.get('talks.json').then((resp) => {
          this.setState({
              talks: resp.data.map(t => {
                  return {...t, id: genTalkID(t) }
              })
          })
      })
  }

  render() {
    const showEventList = () => {
      this.setState({ eventListVisible:  true})
    }

    const exportSelections = () => {
        const selectedKeys = this.state.talks.reduce((acc, t) => {
          if (localStorage.getItem(t.id)) {
            return [...acc, t.id]
          } else {
            return acc
          }
        }, [])

        const lnk = document.createElement('a');
        const file = new Blob([JSON.stringify(selectedKeys, null, 4)], { type: 'text/json' })
        const blobURL =  URL.createObjectURL(file)
        lnk.setAttribute('href', blobURL)
        lnk.setAttribute('target', '_blank')
        document.body.appendChild(lnk)
        lnk.click()
        document.body.removeChild(lnk)
    }

    const importSelections = (e) => {
      const file = e.target.files && e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = (readEvent) => {
          const strData = readEvent.target.result;
          if (!strData)
            return console.warn("Could not read data")

          try {
            const selections = JSON.parse(strData)
            selections.forEach(selectionID => {
              setTalkSelectedByID(selectionID)
            })
          } catch (ex) {
            console.warn("error parsing selections: " + ex)
          }
        }
      }
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

          <button
              hidden={ window.location.href.indexOf('showAll') < 0 }
              className="btn btn-outline-primary"
              onClick={exportSelections}
          >
              Export Selections
          </button>

          <span hidden={ window.location.href.indexOf('showAll') < 0 }>
            <label for="importFile">
            Import Selections:
            </label>
            <input
                id="importFile"
                type="file"
                className="btn btn-outline-primary"
                onChange={importSelections}
            >
            </input>
          </span>
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
