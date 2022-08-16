import React from 'react'

export default function Banner2({children, title, subtitle}) {
  return (
    <div className='banner2'>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className='children'>
        {children}
      </div>
    </div>
  )
}
