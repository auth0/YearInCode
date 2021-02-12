import React from 'react'

const Wrapper: React.FC = ({children}) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          position: 'relative',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </body>
    </html>
  )
}

export default Wrapper
