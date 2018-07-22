export default function groupTalksByHourAndRooms (talks) {
  const hours = {}
  const numHours = 24
  const dayMap = [
    new Date('2018-08-09T00:00:00.000Z'),
    new Date('2018-08-10T00:00:00.000Z'),
    new Date('2018-08-11T00:00:00.000Z'),
    new Date('2018-08-12T00:00:00.000Z'),
    new Date('2018-08-13T00:00:00.000Z')
  ]
  const numDays = dayMap.length

  // go through each day of the conference
  for (let day = 0; day < numDays; day++) {
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

        hours[time.toString()] = talksByLocation
      }
    }
  }

  return hours
}