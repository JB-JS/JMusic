const key = 'USER'

const userStorage = {
  get() {
    const user = localStorage.getItem(key)

    if (!user) return

    const parsed = JSON.parse(user)

    return parsed
  },

  set(info) {
    localStorage.setItem(key, JSON.stringify(info))
  },

  remove() {
    localStorage.removeItem(key)
  },
}

export default userStorage
