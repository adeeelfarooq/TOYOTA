import React from 'react'
import { ScrollSmoother, ScrollToPlugin , ScrollTrigger } from 'gsap/all';
import Hero from './sections/Hero'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Cars from './sections/Cars';
import Marketing from './sections/Marketing';
import TechnologySection from './sections/Technology';
import EngineeringSection from './sections/Engineering';
import TestPage from './sections/Test';
import GlobalMap from './sections/Map';
// import ModernTestimonialsSection from './sections/Testimonial';

gsap.registerPlugin(ScrollTrigger , ScrollToPlugin ,  ScrollSmoother);

const App = () => {
  useGSAP(()=>{
  ScrollSmoother.create({
    smooth: 3,
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
<TechnologySection/>
<EngineeringSection/>
<TestPage/>
<GlobalMap/>

{/* <ModernTestimonialsSection/> */}

</div>
    
        </div>
      </div>
    </main>
   
  )
}

export default App



