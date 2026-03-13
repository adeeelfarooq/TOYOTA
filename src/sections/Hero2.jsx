import { useEffect, useRef } from "react";
import gsap from "gsap";

function Hero2() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const introLogoRef = useRef(null);

  const bgWrapperRef = useRef(null);
  const turbulenceRef = useRef(null);
  const mainTextRef = useRef(null); 
  const uiElementsRef = useRef(null); 
  
  // 🎯 Brush Trail Engine k Refs
  const circlesRef = useRef([]); 
  const circleIndex = useRef(0); 
  const NUM_CIRCLES = 50; 

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { force3D: true } });

      gsap.set(bgWrapperRef.current, { opacity: 0 });
      gsap.set(mainTextRef.current, { opacity: 0, y: 50 });
      gsap.set(uiElementsRef.current, { opacity: 0 });

      // 🔴 INTRO RED SCREEN + LOGO
      tl.set(introRef.current, { yPercent: 0 })
        .fromTo(
          introLogoRef.current,
          { opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          { opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 2, ease: "power3.out" }
        )
        .to({}, { duration: 1 })
        .to(introRef.current, { yPercent: -100, duration: 1.4, ease: "power4.inOut" })
        .to(bgWrapperRef.current, { opacity: 1, duration: 1.5, ease: "power4.out" }, "-=0.7")
        .to(mainTextRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }, "-=1.0")
        .to(uiElementsRef.current, { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=1.0");

      // 🌊 CONTINUOUS BUBBLING ANIMATION
      gsap.to(turbulenceRef.current, {
        attr: { baseFrequency: "0.015 0.025" }, 
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 🎯 Liquid Brush Trail Logic
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    
    if (!sectionRef.current || !bgWrapperRef.current) return;

    // 🖱️ Parallax logic - Targetting ONLY the images, not the wrapper
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    gsap.to(".parallax-target", {
      x: x * 30,
      y: y * 20,
      duration: 1,
      ease: "power2.out"
    });

    // 🖌️ Brush trail logic
    const rect = bgWrapperRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    for (let i = 0; i < 2; i++) {
      const circle = circlesRef.current[circleIndex.current];
      if (circle) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        gsap.killTweensOf(circle);
        gsap.set(circle, { attr: { cx: localX + offsetX, cy: localY + offsetY } });
        gsap.fromTo(circle, { attr: { r: 0 }, opacity: 1 }, { attr: { r: Math.random() * 30 + 80 }, duration: 0.2, ease: "power2.out" });
        gsap.to(circle, { attr: { r: 0 }, opacity: 0, duration: 0.6, delay: 0.8 + Math.random() * 0.4, ease: "power3.inOut" });
      }
      circleIndex.current = (circleIndex.current + 1) % NUM_CIRCLES;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center p-4 lg:p-6"
      onMouseMove={handleMouseMove}
    //   style={{
    //     backgroundImage: "url('/images/bg-1.png')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* 🟢 SVG DEFS */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <radialGradient id="soft-brush">
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <filter id="blob-edge" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="B" />
          </filter>
          <mask id="liquid-trail-mask">
            <rect width="100%" height="100%" fill="black" />
            <g filter="url(#blob-edge)">
              {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
                <circle key={i} ref={(el) => (circlesRef.current[i] = el)} cx="-100" cy="-100" r="0" fill="url(#soft-brush)" />
              ))}
            </g>
          </mask>
          <clipPath id="panel-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.04, 0 L 0.70, 0 C 0.72, 0 0.73, 0.02 0.73, 0.05 L 0.73, 0.15 C 0.73, 0.18 0.74, 0.20 0.77, 0.20 L 0.98, 0.20 C 0.99, 0.20 1.0, 0.22 1.0, 0.25 L 1.0, 0.60 C 1.0, 0.63 0.99, 0.65 0.96, 0.65 L 0.77, 0.65 C 0.74, 0.65 0.73, 0.67 0.73, 0.70 L 0.73, 0.95 C 0.73, 0.98 0.72, 1.0 0.70, 1.0 L 0.04, 1.0 C 0.02, 1.0 0, 0.98 0, 0.95 L 0, 0.05 C 0, 0.02 0.02, 0 0.04, 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* 🔴 INTRO RED SCREEN */}
      <div ref={introRef} className="fixed inset-0 z-[100] bg-toyota-red-soft flex items-center justify-center transform-gpu">
        <img ref={introLogoRef} src="/images/Toyota-logo.svg" alt="Toyota" className="w-40 scale-300" />
      </div>

      {/* 🔲 THE MAIN UI WRAPPER */}
      <div className="relative w-full h-full max-w-[1600px] mx-auto">
        
        {/* 1️⃣ MAIN CONTENT AREA (CLIPPED) */}
        <div 
          ref={bgWrapperRef}
          className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden shadow-2xl"
          style={{
            clipPath: "url(#panel-clip)",
            WebkitClipPath: "url(#panel-clip)",
            backgroundColor: "rgba(0,0,0,0.95)"
          }}
        >
          {/* 🅱️ TOYOTA LAYERS (First Layer Red, Reflection TOY White, OTA Red) */}
          <div ref={mainTextRef} className="absolute z-[-999] inset-0 flex items-center justify-center pointer-events-none mt-10">
            <div className="stacked-text flex flex-col items-center uppercase font-black text-[6rem] md:text-[10rem] lg:text-[15rem] leading-none tracking-tighter" style={{ fontFamily: "'Google Sans Flex', sans-serif" }}>
              <div className="overflow-hidden h-[0.9em] flex items-start"><span className="block text-toyota-red opacity-40">TOYOTA</span></div>
              
              <div className="overflow-hidden h-[0.65em] flex items-start opacity-55 -mt-[0.05em]">
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px white" }}>TOY</span>
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
              </div>
              
              <div className="overflow-hidden h-[0.45em] flex items-start opacity-50 -mt-[0.05em]">
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px white" }}>TOY</span>
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
              </div>
              
              <div className="overflow-hidden h-[0.3em] flex items-start opacity-30 -mt-[0.05em]">
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px white" }}>TOY</span>
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
              </div>
              
              <div className="overflow-hidden h-[0.15em] flex items-start opacity-10 -mt-[0.05em]">
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px white" }}>TOY</span>
                <span className="block text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
              </div>
            </div>
          </div>

          {/* 🏎️ CAR IMAGES (Targeted with 'parallax-target') */}
          <div className="absolute inset-0 w-full h-full parallax-target">
            
            {/* ✨ REFLECTION LAYER ✨ */}
            <div 
              className="absolute inset-0 w-full h-full opacity-40 pointer-events-none -scale-y-100 translate-y-[42%]"
              style={{
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)",
                maskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)"
              }}
            >
              <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover scale-70 " alt="Base Reflection" />
              <img 
                src="/images/spn2.png" 
                className="absolute inset-0 w-full h-full object-cover scale-68 pointer-events-none mt-2 -ml-2" 
                style={{ WebkitMaskImage: "url(#liquid-trail-mask)", maskImage: "url(#liquid-trail-mask)" }} 
                alt="Hover Reflection" 
              />
            </div>

            {/* 🚗 MAIN CAR IMAGES */}
            <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover scale-70 " alt="Base" />
            <img 
              src="/images/spn2.png" 
              className="absolute inset-0 w-full h-full object-cover scale-68 pointer-events-none mt-2 -ml-2" 
              style={{ WebkitMaskImage: "url(#liquid-trail-mask)", maskImage: "url(#liquid-trail-mask)" }} 
              alt="Hover" 
            />

          </div>

          {/* Inner Background Backdrop Commented As Requested */}
          {/* <div
            style={{
              backgroundImage: "url('/images/bg-1.png')",
              backgroundSize: "cover",
            }}
            className="absolute inset-0 z-[-1000] bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" 
          /> */}
        </div>

        {/* 2️⃣ TOP RIGHT MODULE (Replaced SHOP NOW with EXPLORE MODELS) */}
        <div className="absolute top-0 right-0 w-[24%] h-[18%] flex flex-col items-end gap-3 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-toyota-red transition-all cursor-pointer">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-toyota-red transition-all cursor-pointer">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </button>
              <button className="h-12 px-6 rounded-full bg-white text-black font-black text-xs tracking-widest hover:bg-toyota-red hover:text-white transition-all cursor-pointer">
                 CONTACT
              </button>
            </div>
            {/* Button text changed to EXPLORE MODELS, no arrow icon, same tracking */}
            <button 
              onClick={() => gsap.to(window, { duration: 2, scrollTo: "#footer" })}
              className="w-full h-12 rounded-full border border-white/20 text-white font-black text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all cursor-pointer pointer-events-auto"
            >
              EXPLORE MODELS
            </button>
        </div>

        {/* 3️⃣ BOTTOM RIGHT MODULE */}
        <div className="absolute bottom-0 right-0 w-[24%] h-[32%] flex flex-col justify-end gap-3 pointer-events-none">
            <div className="flex justify-end gap-2 pointer-events-auto">
               <button className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center text-xs hover:bg-white hover:text-black transition-all cursor-pointer">←</button>
               <button className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center text-xs hover:bg-white hover:text-black transition-all cursor-pointer">→</button>
            </div>
            <div className="h-[75%] bg-white/5 backdrop-blur-md rounded-[30px] p-4 flex flex-col justify-between border border-white/10 pointer-events-auto group cursor-pointer overflow-hidden relative">
               <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500" alt="card-bg" />
               <div className="z-10 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-toyota-red tracking-widest">GR PERFORMANCE</span>
                  <span className="text-xl font-black text-white leading-none">$1,450</span>
               </div>
               <div className="z-10 self-end bg-toyota-red text-white text-[8px] px-3 py-2 rounded-full font-bold tracking-widest group-hover:bg-white group-hover:text-black transition-colors uppercase">
                  View Specs
               </div>
            </div>
        </div>

      </div>
    </section>
  );
}

export default Hero2;