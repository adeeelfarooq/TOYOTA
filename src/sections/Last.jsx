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
        start: "+=321 top ", 
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
      // Yahan 'h-[150dvh]' kiya gaya hai aur 'items-end pb-6' add kiya hai
      // taake section lamba ho aur video bilkul neechay ja kar place ho.
      className='h-[150dvh] max-w-dvw relative flex items-end justify-center pb-5 overflow-hidden'
      style={{
        // Gradient background for the main container (Ye poori 150dvh ko cover karega, no white space)
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

      {/* BOTTOM LEFT TEXTS (Outside Video Mask) */}
      <div className="absolute bottom-2 left-6 md:left-12 z-20 flex gap-4 text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">
        <span className="cursor-pointer hover:opacity-70 transition-opacity">Privacy Policy</span>
        <span className="cursor-pointer hover:opacity-70 transition-opacity">Terms</span>
      </div>

      {/* BOTTOM RIGHT TEXTS (Outside Video Mask) */}
      <div className="absolute bottom-2 right-6 md:right-12 z-20 text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">
        © 2026 TOYOTA. All rights reserved
      </div>

      {/* 
        Inner Div (SVG Shape): 
        Iska height 'h-[95vh]' fix kar diya hai, taake SVG uper ko stretch na ho.
      */}
      <div 
        className='w-[97%] h-[95vh] relative flex items-center justify-center bg-cover bg-center bg-black'
        style={{
          // YAHAN APNI MARZI KI PIC KA PATH DALEIN
          // backgroundImage: "url('/images/bg-1.png')", 
          clipPath: "url(#lando-shape)"
        }}
        
      >
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        <video 
          ref={videoRef}
          src='videos/footer.webm'
          muted
          playsInline
          preload="auto"
          className='w-full h-full object-contain scale-100 z-10'
        />

        {/* LEFT INSIDE TEXT (PAGES) */}
        <div className="absolute left-[5%] md:left-[8%] top-[45%] -translate-y-1/2 z-20 flex flex-col items-start text-white font-black uppercase tracking-widest leading-none space-y-1 md:space-y-2">
          <span className="text-[10px] text-toyota-red font-bold mb-1">Pages</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Home</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">On Track</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Off Track</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Calendar</span>
          {/* <span className="text-lg md:text-2xl cursor-pointer text-[#c5ff00] mt-3 hover:opacity-80 transition-opacity">Store</span> */}
        </div>

        {/* RIGHT INSIDE TEXT (FOLLOW ON) */}
        <div className="absolute right-[5%] md:right-[8%] top-[45%] -translate-y-1/2 z-20 flex flex-col items-end text-white font-black uppercase tracking-widest leading-none space-y-1 md:space-y-2 text-right">
          <span className="text-[10px] text-toyota-red font-bold mb-1">Follow On</span>
          
        </div>
        
      </div>
      
    </div>
  )
}

export default Lastpage;