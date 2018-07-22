export default function extractLocations(talks) {
  return Object.keys(talks.reduce((acc, talk) => {
    return { ...acc, [talk.location]: true }
  }, {})).sort()
}
