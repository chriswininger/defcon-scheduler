const cheerio = require('cheerio')

module.exports = function processPage(html) {
  const talks = []
  const $ = cheerio.load(html)
  const dateMap = [
    '2018-08-10', // Friday
    '2018-08-11', // Saturday
    '2018-08-12' // Sunday
  ]

  $('tr')
      .each((ndx, el) => {
        if (ndx === 0) {
          return; // skip header row
        }

        const timeString = $(el).children('th').text().trim()
        const numTalks =  $(el).children('td').length

        $(el).children('td').each((ndxChild, child) => {

          // super cheap trick, if there are less than three columns, assume collumns to the left and 1 up had col spans
          let dateIndex = ndxChild
          if (numTalks === '2' || numTalks === 2) {
            dateIndex += 1
          } else if (numTalks === '1' || numTalks === 1) {
            dateIndex = dateIndex + 2
          }

          const date = dateMap[dateIndex]
          const time = new Date(date + 'T' + timeString + 'Z')
          const talk = { time }

          talk.time = time
          talk.speaker =  $(child).html().split('<br>')[1]
          talk.title = $(child).text().trim().replace(talk.speaker, '')
          talk.location = 'Packet Hacking Village'

          // columns spanning two rows are 1 hour, others are 1/2
          talk.duration = child.attribs.rowspan === '2' ? '60 minutes' : '30 minutes'

          talks.push(talk)
          console.log(`   (${ndx}) -- ${$(child).text().trim()} -- numTalkes: "${numTalks}" dateIndex ${dateIndex} `)
        })
      })

  return talks
}