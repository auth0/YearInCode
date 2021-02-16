import React from 'react'

interface WrapperProps {
  bodyStyle?: React.CSSProperties
}

const Wrapper: React.FC<WrapperProps> = ({children, bodyStyle}) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://unpkg.com/modern-normalize@1.0.0/modern-normalize.css"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          position: 'relative',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          ...bodyStyle,
        }}
      >
        {children}
      </body>
    </html>
  )
}

export default Wrapper
