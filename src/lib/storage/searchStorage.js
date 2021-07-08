const key = 'search'

const searchStorage = {
  get(key) {
    const data = localStorage.getItem(key)
    console.log(data)
    if (!data) return null
    return JSON.parse(data)
  },
  set(key, item) {
    localStorage.setItem(key, JSON.stringify(item))
  },
}

export default searchStorage
