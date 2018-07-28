import React from 'react'
import Talk from './talk'

export default function Talks(props) {
  const colClasses =  'talk-col'
  const { talksByTime, times, locations } = props

  return times.map(timeKey => {
    const talksByRoom = talksByTime[timeKey]
    const date = new Date(timeKey)

    // represents bin time (by hour) not exact time of talk
    const strTime = date.toLocaleTimeString('en-US', { timeZone: 'UTC' })

    // get a column for each talk
    const talks = locations.sort().map((loc, ndx) => {
      const talksThisHourThisRoom = talksByRoom[loc]

      if (!talksThisHourThisRoom) {
        // empty place holder column
        return (
            <td
                id={`talk-empty-${ndx}-${Math.round(Math.random() * 1000000)} `}
                key={ndx}
                className={colClasses}>
            </td>
        )
      } else {
        return (
            <td id={`talk-${ndx}-${Math.round(Math.random() * 1000000)}`} key={ndx} className={colClasses}>
              {
                talksThisHourThisRoom
                  .sort((t1, t2) => new Date(t1.time) >= new Date(t2.time))
                  .map((t, iTalk) => {
                    return (
                        <Talk
                            key={ndx + '-' + iTalk}
                            uid={ndx + '-' + iTalk + '-talk'}
                            numTalksInSlot = {talksThisHourThisRoom.length}
                            talk={t}
                        />
                    )
                  })
              }
            </td>
        )
      }
    })

    // return a row for each hour with a column for time followed by talk columns
    return (
        <tr>
          <td className={'timeCol, day' + date.getDate()}>
            { date.toLocaleDateString('en-US', { timeZone: 'UTC' }) + ' '  + strTime }
          </td>
          { talks }
        </tr>
    )
  })
}
