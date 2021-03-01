import path from 'path'

import * as dotenv from 'dotenv'

dotenv.config({
  path: path.resolve('.env.development.local'),
})
