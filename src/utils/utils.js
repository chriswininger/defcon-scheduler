export const genTalkID = (talk) => {
  return talk.title.replace(/\s/g, '_').replace(/[",']/g, '')
}

export const isTalkSelected = (talk) => {
  return localStorage.getItem(genTalkID(talk)) === 'checked'
}

export const getTimeComponent = (date) => {
  return date.toLocaleTimeString('en-US', {timeZone: 'UTC'})
}

export const getDayOfWeek = (dt) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dt.getDay()]
}
