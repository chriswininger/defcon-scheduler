import React from 'react'
import axios from 'axios'
import {genTalkID, isTalkSelected, getTimeComponent, getDayOfWeek} from '../utils/utils'

export default class EventListDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props}
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

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  render() {
    const {visible} = this.state

    const closeDialog = () => {
      this.setState({ visible: false })
    }

    const EventList = ({events}) => {
      if (!events) {
        return <div></div>
      }

      return(
          <div>
            {
              events
                  .filter(event => isTalkSelected(event))
                  .sort((e1, e2) => new Date(e1.time) > new Date(e2.time))
                  .map(event => {
                    const dt = new Date(event.time)
                    return (
                        <p>
                          <span>{getDayOfWeek(dt)}@{getTimeComponent(dt)}</span> -- <span>{event.title}</span>
                        </p>
                    )
                  })
            }
          </div>)
    }

    return(
        <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: visible ? 'inherit' : 'none'}}>
            <div className="modal-dialog modal-lg event-list-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">My Lineup</h5>
                  <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={closeDialog}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ maxHeight: '600px', overflow: 'auto' }}>
                  <EventList
                      events={this.state.talks}
                  />
                </div>
                <div className="modal-footer">
                  <button
                      type="button"
                      className="btn btn-primary"
                      onClick={ () => window.print() }
                  >
                    Print List
                  </button>
                  <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={closeDialog}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="print-section event-list-dialog">
            <EventList
              events={this.state.talks}
            />
          </div>
        </div>
    )
  }
}