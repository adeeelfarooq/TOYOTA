import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Lastpage = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const marqueeRef = useRef(null); // Sponsors marquee ke liye ref
  const personRef = useRef(null);  // Helmet wali image ke liye ref

  // Aapke 8 sponsors ka array
  const sponsors = [
    "/images/Red-bull.png",
    "/images/DENSO.png",
    "/images/HAAS.png",
    "/images/JBL.png",
    "/images/Subaru.png",
    "/images/YAMAHA.png",
    "/images/Mobil-1.png",
    
  ];

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      video.onloadedmetadata = () => {
        video.pause();
        video.currentTime = 0;
      };
    }

    let ctx = gsap.context(() => {

      // INITIAL STATE FIX: Image ko exactly center mein aur neechay chupa diya hai
      if (personRef.current) {
        gsap.set(personRef.current, { xPercent: -50, yPercent: 100 });
      }

      // 1. Video Scroll Animation
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
              const maxTime = videoDuration - 0.05; 
              const targetTime = videoDuration * scrollPos;
              video.currentTime = Math.min(maxTime, targetTime);
            }
          }

          // HELMET PERSON SCROLL LOGIC FIX
          if (personRef.current) {
            let yProg = gsap.utils.mapRange(0.75, 1.0, 100, 0, self.progress);
            yProg = gsap.utils.clamp(0, 100, yProg); 
            // xPercent: -50 ensure karega ke image hamesha center mein rahe
            gsap.set(personRef.current, { yPercent: yProg, xPercent: -50 });
          }
        }
      });

      // 2. GSAP Marquee Animation (Left to Right)
      if (marqueeRef.current) {
        const marqueeTween = gsap.fromTo(
          marqueeRef.current,
          { x: "-50%" }, // Start position (Left shifted)
          { 
            x: "0%",     // End position (Original right pos)
            duration: 25, 
            ease: "none", 
            repeat: -1   // Infinite loop
          }
        );

        // Hover par pause aur play karne ka logic GSAP ke through
        marqueeRef.current.addEventListener("mouseenter", () => marqueeTween.pause());
        marqueeRef.current.addEventListener("mouseleave", () => marqueeTween.play());
      }

    }, containerRef); 

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className='h-[150dvh] max-w-dvw relative flex items-end justify-center pb-5 overflow-hidden'
      style={{
        // Gradient background for the main container
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
      <div className="absolute bottom-2 left-6 md:left-5 z-20 text-[10px] md:text-xs font-bold text-black uppercase tracking-wider">
        © 2026 TOYOTA. <span className='font-paragraph lowercase md:text-[10px] font-extralight'><span className='uppercase'>A</span>ll rights reserved </span>
      </div>

      {/* BOTTOM RIGHT TEXTS (Outside Video Mask) */}
      <div className="absolute bottom-2 right-6 md:right-12 z-20 flex gap-4 text-[10px] md:text-xs font-bold text-black uppercase tracking-wider">
        <span className="cursor-pointer hover:opacity-70 transition-opacity">Privacy Policy</span>
        <span className="cursor-pointer hover:opacity-70 transition-opacity">Terms</span>
      </div>

      {/* Inner Div (SVG Shape) */}
      <div 
        className='w-[97%] h-[95vh] relative flex items-center justify-center bg-cover bg-center bg-black'
        style={{
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
          className='w-full h-full object-contain scale-40 z-10 opacity-60 -translate-y-60'
          style={{ filter: "brightness(0) invert(16%) sepia(93%) saturate(5831%) hue-rotate(349deg) brightness(97%) contrast(110%)" }}
        />

        {/* HELMET PERSON IMAGE FIXED */}
        <img 
          ref={personRef}
          src="images/footer1.png" 
          alt="Toyota Racing Driver"
          // Yahan se inline style aur Tailwind ka -translate-x-1/2 hata diya gaya hai, sab GSAP control kar raha hai
          className="absolute bottom-0 left-1/2 h-[60%] md:h-[80%] object-contain z-[100] pointer-events-none"
        />

        {/* LEFT INSIDE TEXT (PAGES) */}
        <div className="absolute left-[5%] md:left-[8%] top-[45%] -translate-y-1/2 z-20 flex flex-col items-start text-white font-black uppercase tracking-widest leading-none space-y-1 md:space-y-1">
          <span className="text-[10px] text-toyota-red font-bold  mb-4">Pages</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Home</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">On Track</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Off Track</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Calendar</span>
        </div>

        {/* RIGHT INSIDE TEXT (FOLLOW ON) */}
        <div className="absolute right-[5%] md:right-[8%] top-[45%] -translate-y-1/2 z-20 flex flex-col items-end text-white font-black uppercase tracking-widest leading-none space-y-1 md:space-y-1 text-right">
          <span className="text-[10px] text-toyota-red font-bold mb-4">Follow On</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">TikTok</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Instagram</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">YouTube</span>
          <span className="text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition-colors">Twitch</span>
        </div>

        {/* SCROLLING SPONSORS (GSAP CONTROLLED) */}
        <div className="absolute bottom-6 md:bottom-10 w-full overflow-hidden z-20 flex">
          <div 
            ref={marqueeRef} 
            className="flex items-center w-max cursor-pointer"
          >
            {/* Logo Set 1 */}
            {sponsors.map((src, index) => {
              const needsScaling = src.includes('Red-bull') || src.includes('Subaru') || src.includes('Mobil-1') || src.includes('YAMAHA');
               const reduceScaling = src.includes('DENSO')  ;
               

              return (
                <img 
                  key={index} 
                  src={src} 
                  alt="Toyota Sponsor" 
                  className={`h-5 md:h-8 mx-8 md:mx-14 object-contain opacity-60 hover:opacity-100 transition-opacity ${needsScaling ? 'scale-[3.0]' : ''} ${reduceScaling ? 'scale-y-[0.5]' : ''}`} 
                  style={{ filter: "brightness(0) invert(16%) sepia(93%) saturate(5831%) hue-rotate(349deg) brightness(97%) contrast(110%)" }}
                />
              );
            })}
            
            {/* Logo Set 2 (For seamless infinite loop) */}
            {sponsors.map((src, index) => {
              const needsScaling = src.includes('Red-bull') || src.includes('Subaru')  || src.includes('Mobil-1') || src.includes('YAMAHA');
               const reduceScaling = src.includes('DENSO')   ;
              return (
                <img 
                  key={`dup-${index}`} 
                  src={src} 
                  alt="Toyota Sponsor" 
                  className={`h-5 md:h-8 mx-8 md:mx-14 object-contain opacity-60 hover:opacity-100 transition-opacity ${needsScaling ? 'scale-[3.0]' : ''} ${reduceScaling ? 'scale-y-[0.5]' : ''}`} 
                  style={{ filter: "brightness(0) invert(16%) sepia(93%) saturate(5831%) hue-rotate(349deg) brightness(97%) contrast(110%)" }}
                />
              );
            })}
          </div>
        </div>
        
      </div>
      
    </div>
  )
}

export default Lastpage;