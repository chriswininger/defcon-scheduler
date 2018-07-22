const axios = require('axios')
const async = require('async')
const fs = require('fs')
const mainSiteParse = require(__dirname + '/parsers/mainSiteParse')
const sheepParse = require(__dirname + '/parsers/sheepParse')

const sourceMain = 'https://www.defcon.org/html/defcon-26/dc-26-speakers.html'
const sourceSheep = 'https://www.wallofsheep.com/blogs/news/list-of-packet-hacking-village-talks-at-def-con-26-finalized'

async.waterfall([
  _next => {
    // process main site
    axios.get(sourceMain).then(resp => {
      const mainTalks = mainSiteParse(resp.data)
      _next(null, mainTalks)
    }).catch(err => {
      _next(err)
    })
  },
  (mainTalks, _next) => {
    axios.get(sourceSheep).then(resp => {
      const sheepTalks = sheepParse(resp.data)
      _next(null, mainTalks, sheepTalks)
    })
  }
], (err, mainTalks, sheepTalks) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    fs.writeFileSync(__dirname + '/../public/talks.json',
        JSON.stringify([...mainTalks, ...sheepTalks], null, 4), 'utf8')
  }
})
