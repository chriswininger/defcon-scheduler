const axios = require('axios')
const asyncjs = require('async')
const fs = require('fs')
const mainSiteParse = require(__dirname + '/parsers/mainSiteParse')
const sheepParse =    require(__dirname + '/parsers/sheepParse')
const bioParse =      require(__dirname + '/parsers/bioParse')
const cryptoParse =   require(__dirname + '/parsers/cryptoParse')

const sourceMain = 'https://www.defcon.org/html/defcon-26/dc-26-speakers.html'
const sourceSheep = 'https://www.wallofsheep.com/blogs/news/list-of-packet-hacking-village-talks-at-def-con-26-finalized'
const skySource = __dirname + '/../public/talksSky.json' // got lazy and just created json by hand
const sourceCrypto= 'https://calendar.google.com/calendar/embed?mode=AGENDA&height=600&wkst=1&bgcolor=%23ffffff&src=hu0u46121koto04dudv7kosl5c%40group.calendar.google.com&color=%23B1365F&ctz=America%2FLos_Angeles'
const sourceBio = 'https://www.defconbiohackingvillage.org/'

asyncjs.waterfall([
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

      _next(null, [...talks, ...JSON.parse(data)])
    })
  },
  (talks, _next) => {
    (async () => {
      // fun times, need to let js run for this
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      // might as well log these in case something goes wrong (logs from headless client)
      page.on('console', msg => {
        console.log('::client:: - ' + msg._text)
      });

      // navigate to the google calender and wait for network connections to settle and content to load
      await page.goto(sourceCrypto,  {waitUntil: ['networkidle2', 'domcontentloaded']})

      // snag that beautiful fully rendered html
      const calendarHTML = await page.evaluate(() => document.body.innerHTML)

      // close the connection
      await browser.close()

      // parse it
      const cryptoTalks = cryptoParse(calendarHTML)

      _next(null, [...talks, ...cryptoTalks])
    })()
  },
  (talks, _next) => {
    axios.get(sourceBio).then(resp => {
       // currently not appended to results because not fully implemented
       //const cryptoTalks = bioParse(resp.data)
      _next(null, [...talks])
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
