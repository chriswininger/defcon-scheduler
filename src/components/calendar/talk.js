import React from 'react'
import { genTalkID, isTalkSelected, getTimeComponent, getDayOfWeek } from '../../utils/utils'

export default class Talk extends React.Component {

  constructor(props) {
    super(props)
    const talk = props.talk
    const idString = genTalkID(talk)
    this.state = {
      ...props,
      idString,
      checked: isTalkSelected(talk)
    }

    window.addEventListener('storage', e => {
      if (e.key === idString) {
        // keep our state up to date with other tabs
        this.setChecked(e.newValue, true)
      }
    })
  }

  getChecked() {
    return this.state.checked
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

    const date = new Date(talk.time)
    const talkTime = getTimeComponent(date)
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
