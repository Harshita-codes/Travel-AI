import React from 'react'
import { Button } from '../button'
function Header() {
  return (
    <div className='p-2 shadow-sm flex justfy-between items-center px-5'>
     <img src='logo.svg'>
     </img>
     <div className="w-full flex justify-end items-center px-6 py-4">
      <Button>Sign In</Button>
     </div>
    </div>
  )
}

export default Header