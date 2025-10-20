export const storage = {
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Error saving to localStorage', e)
    }
  },

  get(key: string) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Error reading from localStorage', e)
      return null
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Error removing from localStorage', e)
    }
  },
}
