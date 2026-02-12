import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef } from 'react';
import Videos from '../components/Cards';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const TestPage = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);

  // --- NEW: Toyota Tags Data ---
  const tags = [
    { text: "#INNOVATION", top: "15%", left: "5%" },
    { text: "#HYBRID", top: "25%", right: "10%" },
    { text: "#GAZOORACING", top: "50%", left: "15%" },
    { text: "#MOBILITY", top: "45%", right: "20%" },
    { text: "#SUSTAINABILITY", top: "75%", left: "1%" },
    { text: "#SUPRALEGACY", top: "10%", left: "40%" }, 
    { text: "#BEYONDZERO", top: "80%", left: "45%" },
  ];

  useGSAP(() => {
    gsap.set(".message", {
      rotateX: 60,
      rotateY: 1,
      opacity: 0.6,
      transformPerspective: 1000,
    });
    
    // 1. Initial Setups
    gsap.set(".video-card", {
        x: window.innerWidth * 0.9,
        y: window.innerHeight * 0.8,
        rotation: 27, 
        scale: 1,   
        opacity: 1,
    });

    // --- NEW: Tags Initial State (Hidden) ---
    gsap.set(".tag-item", {
        opacity: 0,
        scale: 0.9,
    });
    
    // 2. Master Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000%", 
        scrub: true,
        pin: true,
        markers: false, 
      }
    });

    // --- STEP 1: Text Animation (Same as before) ---
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
    }, "-=1") 

    // --- STEP 2: Videos Entry ---
    // Hum is animation ko ek ID/Label de rahe hain taake calculation kar saken
    .to(".video-card", {
      motionPath: {
        path: [
          { x: window.innerWidth * 0.8, y: window.innerHeight * 0.95 }, 
          { x: -10, y: 120  }, 
          { x: -window.innerWidth * 1.5, y: window.innerHeight * 0.78 } 
        ],
        curviness: 1.7, 
        autoRotate: false 
      },
      rotation: -27, 
      scale: 1,      
      opacity: 1,    
      duration: 5,  // Total Video Duration
      stagger: 0.5,  
      ease: "power1.inOut" 
    }, "-=0.5") // Overlap start

    // --- STEP 3: Text Fade Out & Tags Fade In (AT 35% VIDEO COMPLETION) ---
    // Calculation: "<" means start of previous tween (video).
    // Video Duration is 5. 35% of 5 is 1.75.
    // So we add "+=1.75" delay relative to video start.
    
    .to(textContainerRef.current, {
        opacity: 0,   // Fade out text
        scale: 0.7,   // Subtle shrink
        duration: 2.5,
        ease: "power2.out"
    }, "<+=2.75") 

    .to(".tag-item", {
        opacity: 0.8, // Fade in Tags (Subtle background)
        scale: 1,
        stagger: {
            amount: 1, 
            from: "random"
        },
        duration: 1.5
    }, "<+=0.6"); // Run exactly when text starts fading out


  }, { scope: containerRef });

  return (
    <div 
      id='tests'
      ref={containerRef} 
      className="h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* --- NEW: TAGS LAYER (Background) --- */}
      {/* Absolute positioning behind text and videos */}
      <div className=" absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {tags.map((tag, index) => (
            <h3 
                key={index}
                className="tag-item absolute font-bold text-toyota-red select-none"
                style={{
                    top: tag.top,
                    left: tag.left,
                    right: tag.right,
                    fontSize: "clamp(2rem, 5vw, 6rem)",
                    whiteSpace: "nowrap"
                }}
            >
                {tag.text}
            </h3>
        ))}
      </div>

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
      <div className="absolute top-0 right-0 left-10 w-full h-full z-20 pointer-events-none">
        <Videos />
      </div>
    </div>
  );
};

export default TestPage;