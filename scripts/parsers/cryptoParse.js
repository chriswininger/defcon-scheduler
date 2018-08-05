const cheerio = require('cheerio')

module.exports = function processPage(html) {
  let talks = []
  const $ = cheerio.load(html)

  const dayMap = [
      new Date('8/10/2018'),
      new Date('8/11/2018'),
      new Date('8/12/2018')
  ]

  const getHours = (strTime) => {
    const hour = parseInt(strTime.split(':')[0])
    if (strTime.toLowerCase().indexOf('pm') >= 0) {
      // pm to military time
      return hour + 12
    }

    // am
    return hour
  }

  const getMinutes = (strTime) => parseInt(strTime.split(':')[1].toLowerCase().replace('am', '').replace('pm', ''))

  $('div.day')
    .each((ndxDay, elDay) => {
      const day = dayMap[ndxDay]

       $(elDay).children('.event').each((ndxEvent, elTalk) => {
         const strTime = $(elTalk).children('.event-summary').children('.event-time').text().trim()
         const hours = getHours(strTime)
         const minutes = getMinutes(strTime)
         const time = new Date(day)
         time.setHours(hours)
         time.setMinutes(minutes)

         talks = [
              ...talks,
              {
                time: `${time.toUTCString()}`,
                title: $(elTalk).children('.event-summary').children('.title-wrapper').text().trim(),
                location: 'Crypto Village',
                speaker: ''
              }]
        })
    })

  console.log('!!! talks: ')
  console.log(talks)

  return talks
}