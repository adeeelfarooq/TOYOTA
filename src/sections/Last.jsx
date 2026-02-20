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
              // 0.1 ka matlab hai video 100 milliseconds pehle ruk jayegi. 
              // Agar phir bhi thora fade out ho to isko 0.2 ya 0.3 kar lena.
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
      className='h-screen max-w-dvw relative bg-black flex items-center justify-center overflow-hidden'
    >
      <video 
        ref={videoRef}
        src='videos/footer.mp4'
        muted
        playsInline
        preload="auto"
        className='w-full h-full object-contain scale-100 z-10'
      />
    </div>
  )
}

export default Lastpage;