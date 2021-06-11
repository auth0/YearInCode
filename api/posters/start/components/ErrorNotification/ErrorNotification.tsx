import React from 'react'

import Logo from '@assets/svg/auth0-logo-white.svg'

const ErrorNotification: React.FC = () => (
  <div style={{textAlign: 'center'}}>
    <h2>OOOPS......</h2>
    <p>Looks like there was an issue while we tried to create your poster.</p>
    <p>Please try to come back later.</p>
    <p style={{color: '#BCBCBC', fontWeight: 'bold'}}>
      <span
        style={{
          transform: 'rotate(-30deg)',
          display: 'inline-block',
          fontSize: '14rem',
        }}
      >
        4
      </span>
      <span style={{fontSize: '11rem', marginLeft: 30, marginRight: 20}}>
        0
      </span>
      <span
        style={{
          transform: 'rotate(20deg)',
          display: 'inline-block',
          fontSize: '16rem',
        }}
      >
        4
      </span>
    </p>
    <div
      style={{
        backgroundColor: 'black',
        margin: '0 auto',
        padding: 5,
        width: 89,
      }}
    >
      <Logo aria-hidden width={89} height={32} />
    </div>
  </div>
)

export default ErrorNotification
