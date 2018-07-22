const cheerio = require('cheerio')

module.exports = function processPage(html) {
  const talks = []
  const $ = cheerio.load(html)

  // === helpers ===
  const getTimeFromDetails = details => {
    const dtStr = details.split(' in ')[0]
        .toLowerCase()
        .replace('thursday', '2018-08-09')
        .replace('friday', '2018-08-10')
        .replace('saturday', '2018-08-11')
        .replace('sunday', '2018-08-12')
        .replace(' at ', 'T') + 'Z'

    return new Date(dtStr)
  }

  const getLocationFromDetails = details => {
    return details.split('\n')[0].split(' in ')[1]
  }

  const getDurationFromDetails = details => {
    return details.split('\n')[1].split('|')[0].trim()
  }

  // === process talks ===
  $('article.talk')
      .each((ndx, el) => {
            const talk = {}

            if ($(el).children('p.details').text().indexOf('TBA') >= 0) {
              return
            }

            talk.title = $(el).children('.talkTitle').text()
            talk.speaker = $(el).children('.talkTitle').text()
            talk.time = getTimeFromDetails($(el).children('p.details').text())
            talk.location = getLocationFromDetails($(el).children('p.details').text())
            talk.duration = getDurationFromDetails($(el).children('p.details').text())
            talk.abstract = $(el).children('.abstract').text()

            talks.push(talk)
          }
      )

  return talks
}