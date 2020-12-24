import React from 'react'

import {auth0, UserProfile} from '@lib/auth'
import {createLoginUrl} from '@lib/common'
import {Layout, LoadingView, SelectYearsView} from '@components/death-star'

interface Props {
  user: UserProfile
}

export default function Loading({user}: Props) {
  // TODO: Use network request to trigger screen change
  const [inProgress, setInProgress] = React.useState(false)

  if (inProgress) {
    return <LoadingView />
  }

  return <SelectYearsView setInProgress={setInProgress} />
}

export async function getServerSideProps({req, res}) {
  const session = await auth0.getSession(req)

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: createLoginUrl('/death-star'),
    })
    res.end()

    return {}
  }

  return {props: {user: session.user}}
}

Loading.Layout = Layout
