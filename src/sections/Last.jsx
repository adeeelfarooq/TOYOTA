import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Lastpage = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      video.onloadedmetadata = () => {
        video.pause();
        video.currentTime = 0;
      };
    }

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top", 
        end: "+=250%", 
        pin: true, 
        scrub: true, // Smoothness
        onUpdate: (self) => {
          if (video && video.readyState >= 2) {
            const scrollPos = self.progress; // 0 to 1
            const videoDuration = video.duration;
            
            if (!isNaN(videoDuration)) {
              // FIX: Video ko exact end par jane se rokna (Flicker/Fade Fix)
              const maxTime = videoDuration - 0.05; 
              
              const targetTime = videoDuration * scrollPos;
              
              // Math.min ensure karega ke currentTime maxTime se agay na jaye
              video.currentTime = Math.min(maxTime, targetTime);
            }
          }
        }
      });
    }, containerRef); 

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className='h-screen max-w-dvw relative flex items-center justify-center overflow-hidden '
      style={{
        // Gradient background for the main container
        // backgroundImage: "url('/images/bg-7.png')",
        background: "linear-gradient(to bottom, #000000 0%, #eb0a1e 100%)"
      }}
    >
      
      {/* SVG Mask */}
      <svg className="absolute w-0 h-0">
        <defs>
          <clipPath id="lando-shape" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.00 0.10 
              Q 0.00 0.05, 0.02 0.05 
              L 0.35 0.05 
              C 0.38 0.05, 0.39 0.00, 0.42 0.00 
              L 0.58 0.00 
              C 0.61 0.00, 0.62 0.05, 0.65 0.05 
              L 0.98 0.05 
              Q 1.00 0.05, 1.00 0.10 
              L 1.00 0.93 
              Q 1.00 0.98, 0.98 0.98 
              
              L 0.90 0.98 
              C 0.88 0.98, 0.87 1.00, 0.85 1.00 
              L 0.15 1.00 
              C 0.13 1.00, 0.12 0.98, 0.10 0.98 
              L 0.02 0.98 
              
              Q 0.00 0.98, 0.00 0.93 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* 
        Inner Div (SVG Shape): 
        Yahan color ki jagah backgroundImage laga di gayi hai.
        'bg-cover' aur 'bg-center' usko perfectly fit rakhenge.
      */}
      <div 
        className='w-[97%] h-[95%] relative flex items-center justify-center bg-cover bg-center'
        style={{
          // YAHAN APNI MARZI KI PIC KA PATH DALEIN
          backgroundImage: "url('/images/bg-1.png')", 
          clipPath: "url(#lando-shape)"
        }}
        
      >
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <video 
          ref={videoRef}
          src='videos/footer.webm'
          muted
          playsInline
          preload="auto"
          className='w-full h-full object-contain scale-100 z-10'
        />
      </div>
      
    </div>
  )
}

export default Lastpage;