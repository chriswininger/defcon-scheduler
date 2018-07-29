const cheerio = require('cheerio')

module.exports = function processPage(html) {
  const talks = []
  const $ = cheerio.load(html)

  $('h4.pschedule')
      .each((ndx, elTalk) => {
        const talk = {}
        const time = $(elTalk).children('span.timeslot').text()
        const title = $(elTalk).text().split(':')[2].trim()

        talk.time = time
        talk.title = title

        console.log('!!! talk: ' + JSON.stringify(talk, null, 4))
        talks.push(talk)
      })


  return talks
}