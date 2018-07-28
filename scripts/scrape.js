const axios = require('axios')
const async = require('async')
const fs = require('fs')
const mainSiteParse = require(__dirname + '/parsers/mainSiteParse')
const sheepParse = require(__dirname + '/parsers/sheepParse')

const sourceMain = 'https://www.defcon.org/html/defcon-26/dc-26-speakers.html'
const sourceSheep = 'https://www.wallofsheep.com/blogs/news/list-of-packet-hacking-village-talks-at-def-con-26-finalized'
const skySource = __dirname + '/../public/talksSky.json'

async.waterfall([
  _next => {

    // process main site
    axios.get(sourceMain).then(resp => {
      const mainTalks = mainSiteParse(resp.data)
      _next(null, [...mainTalks])
    }).catch(err => {
      _next(err)
    })
  },

  // process the packet hacking site
  (talks, _next) => {
    axios.get(sourceSheep).then(resp => {
      const sheepTalks = sheepParse(resp.data)
      _next(null, [...talks, ...sheepTalks])
    })
  },

  // cheap trip for sky talks, no time to scrape a google doc
  (talks, _next) => {
    fs.readFile(skySource, 'utf8', (err, data) => {
      if (err) {
        return _next(err)
      }

      console.log('!!! data: ' + data)
      _next(null, [...talks, ...JSON.parse(data)])
    })
  }
], (err, talks) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    fs.writeFileSync(__dirname + '/../public/talks.json',
        JSON.stringify(talks, null, 4), 'utf8')
  }
})
