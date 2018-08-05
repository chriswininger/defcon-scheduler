const cheerio = require('cheerio')

module.exports = function processPage(html) {
  let talks = []
  const $ = cheerio.load(html)

  const dayMap = [
    new Date('2018-08-10T00:00:00.000Z'), // Friday
    new Date('2018-08-11T00:00:00.000Z'), // Saturday
    new Date('2018-08-12T00:00:00.000Z'), // Sunday
  ]

  const getHours = (strTime) => {
    const hour = parseInt(strTime.split(':')[0])
    if (strTime.toLowerCase().indexOf('pm') >= 0 && hour != 12) {
      // pm to military time
      return hour + 12
    }

    // am
    return hour
  }

  const getMinutes = (strTime) => {
    if (strTime.indexOf(':') <= 0) {
      // using shorthand 12pm, no minutes
      return 0
    }

    return parseInt(strTime.split(':')[1].toLowerCase().replace('am', '').replace('pm', ''))
  }

  $('div.day')
    .each((ndxDay, elDay) => {
      const day = dayMap[ndxDay]

       $(elDay).children('.event').each((ndxEvent, elTalk) => {
         const strTime = $(elTalk).children('.event-summary').children('.event-time').text().trim()
         const strEndTime = $(elTalk).children('.event-summary').children('.event-time')[0].attribs.alt
             .split(',')[2].split('–')[1].trim()
         const hours = getHours(strTime)
         const minutes = getMinutes(strTime)
         const endHours = getHours(strEndTime)
         const endMinutes = getMinutes(strEndTime)
         const duration = (endHours - hours) * 60 + (endMinutes - minutes)

         const time = new Date(day)

         /*
            Seriously, setHours converts to local time regardless of original date time zone, use setUTCHours or
             you will got mad, JavaScript Date/Time BS is insane!
          */
         time.setUTCHours(hours, minutes)

         talks = [
              ...talks,
              {
                title: $(elTalk).children('.event-summary').children('.title-wrapper').text().trim(),
                location: 'Crypto Village',
                speaker: '',
                time: `${time.toUTCString()}`,
                duration: duration,
              }]
        })
    })

  console.log('!!! talks: ')
  console.log(talks)

  return talks
}