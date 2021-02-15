import React from 'react'

interface InfoBoxProps {
  label: string
  value: string
}

const InfoBox: React.FC<InfoBoxProps> = ({label, value}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginBottom: '2rem',
        maxWidth: '18rem',
      }}
    >
      <div
        style={{
          marginBottom: '0.4rem',
          fontSize: '1.1rem',
          textTransform: 'uppercase',
          color: '#57585A',
          fontWeight: 600,
          letterSpacing: '0.2em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '1.7rem',
          color: '#fff',
          fontWeight: 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>
    </div>
  )
}

export default InfoBox
