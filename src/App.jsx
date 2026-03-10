import React from 'react'
import { ScrollSmoother, ScrollToPlugin , ScrollTrigger } from 'gsap/all';
// import Hero from './sections/Hero'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Cars from './sections/Cars';
import Marketing from './sections/Marketing';
import TechnologySection from './sections/Technology';
import EngineeringSection from './sections/Engineering';
import TestPage from './sections/Test';
import GlobalMap from './sections/Map';
import Lastpage from './sections/Last';
import Hero from './sections/Hero';
// import ModernTestimonialsSection from './sections/Testimonial';

gsap.registerPlugin(ScrollTrigger , ScrollToPlugin ,  ScrollSmoother);

// 🚀 GLOBAL GSAP OPTIMIZATIONS (Lag khatam karne ke liye)
gsap.config({
  nullTargetWarn: false,
  force3D: true, // Har cheez ko GPU par force karega
});

ScrollTrigger.config({
  ignoreMobileResize: true, // Mobile par scroll ko stuck nahi hone dega
});

// Heavy paints aur lag ko rokne ke liye
ScrollTrigger.normalizeScroll(true);

const App = () => {
  useGSAP(()=>{
    ScrollSmoother.create({
      smooth: 2, // 🔥 3 bohot heavy tha, 1.2 heavy websites k liye perfect aur smooth hai
      effects: true,
      smoothTouch: 0.1, // Mobile par bhi smooth karega
    })
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
            <GlobalMap/>
            <TestPage/>
            <Lastpage/>
            {/* <ModernTestimonialsSection/> */}
          </div>
        
        </div>
      </div>
    </main>
  )
}

export default App