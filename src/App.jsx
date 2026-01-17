import React from 'react'

import { ScrollSmoother, ScrollToPlugin , ScrollTrigger } from 'gsap/all';
import Hero from './sections/Hero'
import Message from './sections/Message'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Cars from './sections/Cars';
import Marketing from './sections/Marketing';



gsap.registerPlugin(ScrollTrigger , ScrollToPlugin ,  ScrollSmoother);

const App = () => {
  useGSAP(()=>{
  ScrollSmoother.create({
    smooth: 2,
    effects: true,
  } )
}) 
  
  
  return (
    <main>
      <div id="smooth-wrapper">   
      <div id="smooth-content">
         
<Hero/>
<Cars/>
<div>


<Marketing/>
<Message/>
</div>
    
        </div>
      </div>
    </main>
   
  )
}

export default App