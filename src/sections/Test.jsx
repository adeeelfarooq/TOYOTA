import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef } from 'react';
import Videos from '../components/Cards';


gsap.registerPlugin(ScrollTrigger);

const TestPage = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);

  useGSAP(() => {
    
    // 1. Initial Setups
    gsap.set(".message", {
      rotateX: 60,
      rotateY: 1,
      opacity: 0.6,
      transformPerspective: 1000,
    });

    // Videos ko screen ke neeche bhej do initially
    gsap.set(".video-card", {
        y: window.innerHeight * 1.5,
        opacity: 1
    });
    
    // 2. Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000%", // Scroll height barha di taake animation smooth ho
        scrub: 1,
        pin: true,
        markers: false, // Markers hata diye clean look k liye
      }
    });

    // --- STEP 1: Text Animation ---
    tl.fromTo(textContainerRef.current,
      {
        scale: 15,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.out",
        duration: 2, 
      }
    )
    .to(".message" , {
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      transformPerspective: 1000,
      duration: 1
    }, "-=1") // Thora overlap smooth feel k liye

    // --- STEP 2: Videos Entry ---
    // Text animation k baad ye chalega
    .to(".video-card", {
        y: 0, // Wapis apni original jagah (CSS positioning) par aayengi
        opacity: 1,
        duration: 3,
        stagger: 1.8, // Ek k baad ek video aayegi
        ease: "power3.out"
    });

  }, { scope: containerRef });

  return (
    <div 
      id='tests'
      ref={containerRef} 
      className="h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* TEXT LAYER */}
      <div 
        ref={textContainerRef} 
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10"
      >
        <h1 className="uppercase message text-white text-6xl md:text-8xl lg:text-[16rem] font-bold tracking-tight leading-none">
          Voices Of
        </h1>
        
        <h2 className="uppercase message-two ml-14 text-toyota-red text-6xl md:text-[10rem] lg:text-[16rem] font-bold tracking-[1rem] md:tracking-[2.3rem] -mt-2 md:mt-4">
          Toyota
        </h2>
      </div>

      {/* VIDEO LAYER */}
      <div className="absolute top-0 right-0 w-full h-full z-20 pointer-events-none">
        <Videos />
      </div>
    </div>
  );
};

export default TestPage;