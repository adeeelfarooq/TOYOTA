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
      rotateY: 1,
      
      opacity: 0.6,
      transformPerspective: 1000,
    })
    
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%",
        scrub: true,
        pin: true,
        markers: true,
      }
    });

    // STEP 1: Zoom in text
    tl.fromTo(textContainerRef.current,
      {
        scale: 15,
        opacity: 0,
        // ADD initial rotation for .message elements
        
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.out",
        duration: 1,
      }
    ).to(".message" , {
      rotateX: 0,
      rotateY: 0,
      
      opacity: 1,
      transformPerspective: 1000,
      
    } , "-=0.3")
    

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="h-dvh w-full bg-black relative flex flex-col items-center justify-center overflow-hidden"
    >
      <div 
        ref={textContainerRef} 
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none"
      >
        <h1 className="uppercase message text-white text-6xl md:text-8xl lg:text-[16rem] font-bold tracking-tight leading-none z-10">
          Voices Of
        </h1>
        
        <h2 className="uppercase message-two ml-14 text-toyota-red text-6xl md:text-[10rem] lg:text-[16rem] font-bold tracking-[1rem] md:tracking-[2.3rem] -mt-2 md:mt-4 z-10">
          Toyota
        </h2>
      </div>
    </div>
  );
};

export default TestPage;