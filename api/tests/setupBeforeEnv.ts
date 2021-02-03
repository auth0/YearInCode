import path from 'path'

import {setup} from 'jest-dynalite'
import * as dotenv from 'dotenv'

dotenv.config({
  path: path.resolve('.env.development.local'),
})

setup(__dirname)
