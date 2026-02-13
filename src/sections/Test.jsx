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

  // Toyota Tags Data
  const tags = [
    { text: "#INNOVATION", top: "15%", left: "5%" },
    { text: "#HYBRID", top: "25%", right: "10%" },
    { text: "#GAZOORACING", top: "50%", left: "15%" },
    { text: "#MOBILITY", top: "45%", right: "20%" },
    { text: "#SUSTAINABILITY", top: "75%", left: "1%" },
    { text: "#SUPRALEGACY", top: "10%", left: "40%" }, 
    { text: "#BEYONDZERO", top: "80%", left: "45%" },
    { text: "#FUTURE", top: "62%", right: "1%" },
  ];

  useGSAP(() => {
    // Clean up only our container's triggers
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === containerRef.current || 
          st.vars.trigger === containerRef.current) {
        st.kill();
      }
    });

    // Initial states
    gsap.set(".message", {
      rotateX: 60,
      rotateY: 1,
      opacity: 0.6,
      transformPerspective: 1000,
    });
    
    gsap.set(".video-card", {
      x: window.innerWidth * 0.9,
      y: window.innerHeight * 0.8,
      rotation: 27, 
      scale: 1,   
      opacity: 1,
    });

    gsap.set(".tag-item", {
      opacity: 0,
      scale: 0.9,
    });
    
    // Master Timeline with reduced end value
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000%", // Reduced from 2000% to 300%
        scrub: 1.5, // Increased scrub for smoother animation
        pin: true,
        
        id: "testPage-scrollTrigger",
        invalidateOnRefresh: true,
      }
    });

    // STEP 1: Text Animation
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
    .to(".message", {
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      transformPerspective: 1000,
      duration: 1
    }, "-=1")

    // STEP 2: Videos Entry
    .to(".video-card", {
      motionPath: {
        path: [
          { x: window.innerWidth * 0.8, y: window.innerHeight * 0.95 }, 
          { x: -10, y: 120 }, 
          { x: -window.innerWidth * 1.5, y: window.innerHeight * 0.78 } 
        ],
        curviness: 1.7, 
        autoRotate: false 
      },
      rotation: -27, 
      scale: 1,      
      opacity: 1,    
      duration: 5,
      stagger: 0.5,  
      ease: "power1.inOut" 
    }, "-=0.5")

    // STEP 3: Text Fade Out (Simplified timing)
    .to(textContainerRef.current, {
      opacity: 0,
      scale: 0.7,
      duration: 2.5,
      ease: "power2.out"
    }, "<+=2.75") // Start 1.5 seconds after video starts

    // STEP 4: Tags Fade In
    .to(".tag-item", {
      opacity: 0.8,
      scale: 1,
      stagger: {
        amount: 1.5,
        from: "random"
      },
      duration: 2
    }, "<+=1.2"); // Overlap with text fade out

    // Force refresh
    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current || 
            st.vars.trigger === containerRef.current) {
          st.kill();
        }
      });
    };

  }, { scope: containerRef });

  return (
    <div 
      id='tests'
      ref={containerRef} 
      className="h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* TAGS LAYER */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
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