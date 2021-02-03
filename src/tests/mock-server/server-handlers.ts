import {rest} from 'msw'

import {buildUserProfile} from '@web/tests/generate'
import {constants} from '@web/lib/common'

const {api} = constants

const handlers = [
  rest.get(`${api.url}/me`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(buildUserProfile()))
  }),
]

export {handlers}
