import {rest} from 'msw'

import {buildUserProfile} from '@test/generate'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const handlers = [
  rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({...buildUserProfile()}))
  }),
]

export {handlers}
