import React from 'react'

interface InfoColProps {
  label: string
  value: string
}

const InfoCol: React.FC<InfoColProps> = ({label, value}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          marginBottom: '1rem',
          fontSize: '1.1rem',
          textTransform: 'uppercase',
          color: '#57585A',
          fontWeight: 600,
          letterSpacing: '0.2em',
        }}
      >
        {label}
      </div>
      <div style={{fontSize: '1.7rem', color: '#fff', fontWeight: 400}}>
        {value}
      </div>
    </div>
  )
}

export default InfoCol
