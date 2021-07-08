export const toHMS = (duration) => {
  const minute = Math.floor((duration / 60) % 60)
  const hour = Math.floor(duration / 3600)
  const partsec = Math.floor(duration - minute * 60 - hour * 3600)

  const calcMinute = hour ? (minute < 10 ? `0${minute}` : minute) : minute

  return `${hour > 0 ? `${hour}:` : ''}${calcMinute}:${
    partsec >= 10 ? partsec : `0${partsec}`
  }`
}

export const HourMinute = (duration) => {
  const hour = Math.floor(duration / 3600)
  const minute = Math.floor((duration / 60) % 60)

  return `${hour > 0 ? `${hour}시간` : ''} ${minute > 0 ? `${minute}분` : ''}`
}
