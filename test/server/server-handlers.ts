import {rest} from 'msw'

import {buildUserProfile} from '@test/generate'
import {constants} from '@lib/common'

const {api} = constants

const handlers = [
  rest.get(`${api.url}/me`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({...buildUserProfile()}))
  }),
]

export {handlers}
