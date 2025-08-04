import { useState } from 'react'
/*import PlaceAutocomplete from './components/PlaceAutocomplete'*/
import Hero from './components/ui/custom/Hero.jsx'        
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
     {/*hero*/}
     <Hero/>
    </>     
     
  )
}

export default App
