import axios from 'axios'
import { get, cloneDeep } from 'lodash'

import localStorageSvc from './local-storage'
const API_URL = process.env.API_URL

const USER = {
  id: 0,
  company: '',
  username: 'Guest',
  permissions: ['home', 'login', 'about']
}

const me = {}
let meData = {}

const setData = (data = {}, store = true) => {
  const newData = Object.assign(cloneDeep(USER), data)
  meData = Object.freeze(newData)
  if (store) {
    localStorageSvc.set('currentUser', meData)
  }
}

me.login = params => {
  return axios
    .post(
      `${API_URL}/rest/auth/login`,
      {
        username: params.username,
        company: params.company,
        password: params.password
      },
      {
        withCredentials: true
      }
    )
    .then(({ data }) => {
      setData(data.result)
      return meData
    })
    .catch(error => {
      let message = get(error, 'response.data.message')
      if (!message) {
        message = 'Could not be login. Try again in a few minutes.'
      }
      return Promise.reject(message)
    })
}

me.logout = () => {
  return axios
    .delete(`${API_URL}/rest/auth/logout`)
    .then(() => {
      setData(cloneDeep(USER))
      return meData
    })
    .catch(error => {
      return Promise.reject('Could not be logout. Try again.')
    })
}

me.get = () => meData

setData(localStorageSvc.get('currentUser') || undefined, false)

export default me
