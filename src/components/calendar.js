import React from 'react'
import axios from 'axios'

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { talks: [] }
  }

  render() {
    const colClasses =  'talkCol' //'col-sm justify-content-center'
    const extractLocations = (talks) => {
      return Object.keys(talks.reduce((acc, talk) => {
        return { ...acc, [talk.location]: true }
      }, {})).sort()
    }

    const groupTalksByHourAndRooms = (talks) => {
      const hours = {}
      const talkSlots = 4 // pad all everything to six location columns
      const numHours = 24
      const dayMap = [
        new Date('2018-08-09T00:00:00.000Z'),
        new Date('2018-08-10T00:00:00.000Z'),
        new Date('2018-08-11T00:00:00.000Z'),
        new Date('2018-08-12T00:00:00.000Z'),
        new Date('2018-08-13T00:00:00.000Z')
      ]
      const numDays = dayMap.length

      console.log('!!! numDays: ' + numDays)
      // go through each day of the conference
      for (let day = 0; day < numDays; day++) {

        console.log('!!! checking days: ' + dayMap[day])

        // every hour of the day
        for (let hour = 1; hour <= numHours; hour++) {
          // get a date object for this day and hour
          const time = new Date(new Date(dayMap[day]).setHours(hour))

          // filter out all talks that fit within this hour
          const talksInHour = talks.filter(talk => {
            return new Date(talk.time) >= time &&
                new Date(talk.time) < new Date(new Date(time).setHours(time.getHours() + 1))
          })

          // check that the hour had talks in it
          if (talksInHour.length > 0) {
            // group the talks in this hour by their locations
            const talksByLocation = talksInHour.reduce((acc, t) => {
              acc[t.location] = acc[t.location] || [] // initialize array for the location if not present
              acc[t.location].push(t) // add the talk to its location bin
              return acc
            }, {})

            // pad out for empty room columns
            const numEmptyRooms = talkSlots - Object.keys(talksByLocation).length
            for (let i = 0; i < numEmptyRooms; i++) {
              // just a place holder
              talksByLocation[`Empty-${i}`] = 'EMPTY'
            }
            hours[time.toString()] = talksByLocation
          }
        }
      }

      return hours
    }


    const talksByTime = groupTalksByHourAndRooms(this.state.talks)
    const times = Object.keys(talksByTime)
    const talksJSX = times.map(timeKey => {
      const talksByRoom = talksByTime[timeKey]
      const locations = Object.keys(talksByRoom)

      // get a column for each talk
      const talks = locations.sort().map((loc, ndx) => {
        const talksThisHourThisRoom = talksByRoom[loc]

        if (talksThisHourThisRoom === 'EMPTY') {
          // empty place holder column
          return (
              <td id={`talk-empty-${ndx}-${Math.round(Math.random() * 1000000)} `} className={colClasses}></td>
          )
        } else {
          return (
              <td id={`talk-${ndx}-${Math.round(Math.random() * 1000000)}`} className={colClasses}>
                {talksThisHourThisRoom.map(t => (<div>{t.title}</div>))}
              </td>
          )
        }
      })

      // return a row for each hour with a column for time followed by talk columns
      return (
          <tr>
            <td className='timeCol'>
              { new Date(timeKey).toLocaleDateString() + ' '  + new Date(timeKey).toLocaleTimeString() }
            </td>
            { talks }
          </tr>
      )
    })

    const headersJSX = extractLocations(this.state.talks).map((location) => {
      return (
          <th scope="col" className={colClasses}>
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
          { talksJSX }
          </tbody>
        </table>
    )
  }

  componentDidMount() {
    axios.get('talks.json').then((resp) => {
      this.setState({ talks:  resp.data })
    })
  }
}