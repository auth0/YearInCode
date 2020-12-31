import axios from 'axios'

import {constants} from '@lib/common'

export default axios.create({
  baseURL: constants.api.url,
  timeout: 10000,
})
