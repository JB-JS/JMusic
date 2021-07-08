const key = 'volume'

const volumeStorage = {
  get() {
    const data = localStorage.getItem(key)

    if (!data) return null
    return data
  },
  set(volume) {
    localStorage.setItem('volume', volume)
  },
}

export default volumeStorage
