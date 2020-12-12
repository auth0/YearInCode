import axios from 'axios'

import api from '@constants/api'

export default axios.create({
  baseURL: api.url,
  timeout: 10000,
})
