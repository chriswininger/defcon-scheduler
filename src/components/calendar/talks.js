import React from 'react'

export default function Talks(props) {
  const colClasses =  'talkCol'
  const { talksByTime, times, locations } = props
  const getDayOfWeek = (dt) => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[dt.getDay()]
  }


  return times.map(timeKey => {
    const talksByRoom = talksByTime[timeKey]
    const date = new Date(timeKey)
    const strTime = date.toLocaleTimeString('en-US', { timeZone: 'UTC' })

    // get a column for each talk
    const talks = locations.sort().map((loc, ndx) => {
      const talksThisHourThisRoom = talksByRoom[loc]

      if (!talksThisHourThisRoom) {
        // empty place holder column
        return (
            <td id={`talk-empty-${ndx}-${Math.round(Math.random() * 1000000)} `} className={colClasses}></td>
        )
      } else {
        const numTalksInSlot = talksThisHourThisRoom.length
        return (
            <td id={`talk-${ndx}-${Math.round(Math.random() * 1000000)}`} className={colClasses}>
              {talksThisHourThisRoom.map(t => {
                const talkSlot = (
                    <div data-toggle="tooltip"
                         data-placement="top"
                         title={t.location + ' -- ' + getDayOfWeek(date) + ' ' + strTime + ', ' + (t.abstract || t.title)}>
                      {t.title}
                    </div>
                )

                if (numTalksInSlot > 1) {
                  return (
                      <div>
                        {talkSlot}
                        <hr />
                      </div>
                  )
                } else {
                  return (
                      <div>
                        {talkSlot}
                      </div>
                  )
                }
              })}
            </td>
        )
      }
    })

    // return a row for each hour with a column for time followed by talk columns
    return (
        <tr>
          <td className={'timeCol, ' + 'day' + date.getDate()}>
            { date.toLocaleDateString('en-US', { timeZone: 'UTC' }) + ' '  + strTime }
          </td>
          { talks }
        </tr>
    )
  })
}
