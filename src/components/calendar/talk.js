import React from 'react'

export default class Talk extends React.Component {

  constructor(props) {
    super(props)
    const idString = props.talk.title.replace(/\s/g, '_').replace(/[",']/g, '')
    this.state = {
      ...props,
      idString,
      checked: localStorage.getItem(idString) === 'checked'
    }

    window.addEventListener('storage', e => {
      if (e.key === idString) {
        // keep our state up to date with other tabs
        this.setChecked(e.newValue, true)
      }
    })
  }

  getChecked() {
    return this.state.checked || localStorage.getItem(this.state.idString) === 'checked'
  }

  setChecked(checked, skipStorage) {
    if (checked) {
      this.setState({ checked: true })
      if (!skipStorage) {
        localStorage.setItem(this.state.idString, 'checked')
      }
    } else {
      this.setState({ checked: false })
      if (!skipStorage) {
        localStorage.removeItem(this.state.idString)
      }
    }
  }

  render() {
    const { talk, numTalksInSlot, uid, idString } = this.state

    const getDayOfWeek = (dt) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[dt.getDay()]
    }

    const date = new Date(talk.time)
    const talkTime = date.toLocaleTimeString('en-US', {timeZone: 'UTC'})
    const talkSlot = (
        <div
            key={'talk-title- ' + uid}
            data-toggle="tooltip"
             data-placement="top"
             className="talk-title"
             id={`div_${idString}`}
             title={`${talk.location} -- ${getDayOfWeek(date)} ${talkTime}, (${talk.abstract || talk.title})`}>
          {talk.title}
        </div>
    )

    return (
        <div key={uid} className={numTalksInSlot > 1 ? 'talk-divider' : ''}>
          <input
              key={uid}
              type="checkbox"
              value=""
              checked={this.getChecked()}
              id={`check_box_${idString}`}
              onChange={({target}) => this.setChecked(target.checked)}
              className="talk-check"/>
          {talkSlot}
        </div>
    )
  }
}
