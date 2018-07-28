import React from 'react'
import axios from 'axios'
import groupTalksByHourAndRooms from './groupTalksByHourAndRoom'
import extractLocations from './extractLocations'
import Talks from './talks'


export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { talks: [] }
  }

  render() {
    const colClasses =  'talkCol' //'col-sm justify-content-center'
    const locations = extractLocations(this.state.talks).sort()
    const talksByTime = groupTalksByHourAndRooms(this.state.talks)
    const times = Object.keys(talksByTime)

    const headersJSX = locations.map((location, i) => {
      return (
          <th scope="col" className={colClasses} key={i + '-header'}>
            { location }
          </th>)
    })

    return (
        <table className="defcon-scheduler-calendar table table-dark table-bordered table-hover">
          <thead>
            <tr>
              <th scope="col" className={colClasses}>
                Time
              </th>
            {  headersJSX }
            </tr>
          </thead>
          <tbody>
            <Talks
                times={times}
                locations={locations}
                talksByTime={talksByTime}
            />
          </tbody>
        </table>
    )
  }

  componentDidMount() {
    axios.get('talks.json').then((resp) => {
      this.setState({ talks:  resp.data })
       // $('[data-toggle="tooltip"]').tooltip()
    })
  }
}