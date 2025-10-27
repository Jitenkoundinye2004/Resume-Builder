import React from 'react'

const Title = ({title , description}) => {
  return (
    <div className='text-center mt-6 text-black'>
      <h2 className='text-3xl sm:text-rxl font-medium'>{title}</h2>
      <p className='max-sm max-w-2xl mt-4 text-[#0F1710]'>{description}</p>
    </div>
  )
}

export default Title
