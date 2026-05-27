const PREFIX = 'duofinancas_'

export const useLocalCache = () => {
  const set = (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.warn('localStorage set failed:', e)
    }
  }

  const get = (key) => {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  const remove = (key) => {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (e) {
      console.warn('localStorage remove failed:', e)
    }
  }

  const setPending = (key, value) => {
    const pending = get('pending_sync') || {}
    pending[key] = { value, timestamp: Date.now() }
    set('pending_sync', pending)
  }

  const getPending = () => get('pending_sync') || {}

  const clearPending = (key) => {
    const pending = get('pending_sync') || {}
    delete pending[key]
    set('pending_sync', pending)
  }

  return { set, get, remove, setPending, getPending, clearPending }
}
