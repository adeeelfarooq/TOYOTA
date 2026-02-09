import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const TestPage = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);

  useGSAP(() => {

    gsap.set(".message" , {
    rotateX: 60,
    rotateY: 5,
    scale: 1,
    opacity: 0.6,
    transformPerspective: 1000,
    
    })
    
    // Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",       
        end: "+=270%",          
        // CHANGE 1: Scrub ko 0 kiya. 
        // Iska matlab hai 'No Wait'. Scroll karte hi animation chalegi.
        scrub: 0,             
        pin: true,
        markers: true,
      }
    });

    

    // Animation: Center se nikal kar screen par fit hona
    tl.fromTo(textContainerRef.current,
      {
        scale: 15,         // Bohot bada (Screen ke beech me se niklega)
        opacity: 0,        // Shuru me invisible
               // Z-axis par close
      },
      {
        scale: 1,          // Normal Size
        opacity: 1,        // Fully Visible
        z: 0,
        ease: "power3.inOut", // Smooth easing
        duration: 10,       // Timeline ka duration (scroll ke hisab se adjust hoga)
      }
    ).to(".message" ,  {
      rotateX: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    transformPerspective: 1000,
    
    
    
    }, "-=1.5")

    // Optional: Agar aap chahte hain ke text thoda sa 3D rotate bhi kare (Ethical Life style)
    // To upar wali animation me 'rotateX: 20' add kar sakte hain 'from' mein aur '0' 'to' mein.

  }, { scope: containerRef });

  return (
    <div 
    
      ref={containerRef} 
      className="h-dvh w-full bg-black relative flex flex-col items-center justify-center overflow-hidden"
       // 3D effect ke liye zaroori hai
    >
      
      {/* Text Container */}
      <div 
        ref={textContainerRef} 
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none"
        // Performance ke liye
      >
        {/* Voices Of - White Text */}
        <h1 className="uppercase message text-white text-6xl md:text-8xl lg:text-[16rem] font-bold tracking-tight leading-none z-10">
          Voices Of
        </h1>
        
        {/* TOYOTA - Red Text */}
        <h2 className="uppercase message-two ml-14 text-toyota-red text-6xl md:text-[10rem] lg:text-[16rem] font-bold tracking-[1rem] md:tracking-[2.3rem] -mt-2 md:mt-4 z-10">
          Toyota
        </h2>
      </div>

    </div>
  );
};

export default TestPage;