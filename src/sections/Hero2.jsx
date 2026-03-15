import { useEffect, useRef } from "react";
import gsap from "gsap";
// 🟢 EXTRACTED COMPONENTS IMPORTS
import { useAutoInk, AutoInkMaskElements, AutoInkVisualElements } from "../components/Smoke"
import { useCarMaskReveal, MouseTrailMaskElements, CarImagesLayer } from "../components/CarMaskReveal";

function Hero2() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const introLogoRef = useRef(null);
  const bgWrapperRef = useRef(null);
  const turbulenceRef = useRef(null);
  const mainTextRef = useRef(null);
  const uiElementsRef = useRef(null);

  // 🎯 Importing Auto Ink Logic
  const {
    autoInkGroupMaskRef, autoInkGroupVisRef, autoInkMaskRef, autoInkVisualRef, autoPartsMaskRef, autoPartsVisRef, NUM_AUTO_PARTS
  } = useAutoInk(sectionRef);

  // 🎯 Importing Car Mask & Hover Logic
  const {
    circlesRef, NUM_CIRCLES, handleMouseMove, handleImageEnter, handleImageLeave
  } = useCarMaskReveal(sectionRef, bgWrapperRef, autoInkGroupMaskRef, autoInkGroupVisRef);

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
        attr: { baseFrequency: "0.015 0.025" }, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut"
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center p-4 lg:p-6" onMouseMove={handleMouseMove} onMouseLeave={handleImageLeave}>
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* 🟢 SVG DEFS */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <radialGradient id="soft-brush">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="lando-ink">
            <stop offset="10%" stopColor="#1e1e1e" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#0a0a0a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <filter id="blob-edge" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          
          <mask id="liquid-trail-mask">
            <rect width="100%" height="100%" fill="black" />
            <g filter="url(#blob-edge)">
              <AutoInkMaskElements autoInkGroupMaskRef={autoInkGroupMaskRef} autoInkMaskRef={autoInkMaskRef} autoPartsMaskRef={autoPartsMaskRef} NUM_AUTO_PARTS={NUM_AUTO_PARTS} />
              <MouseTrailMaskElements circlesRef={circlesRef} NUM_CIRCLES={NUM_CIRCLES} />
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
        <div ref={bgWrapperRef} className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden shadow-2xl" style={{ clipPath: "url(#panel-clip)", WebkitClipPath: "url(#panel-clip)", backgroundColor: "rgba(0,0,0,0.95)" }}>
          
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
             <g filter="url(#blob-edge)">
               <AutoInkVisualElements autoInkGroupVisRef={autoInkGroupVisRef} autoInkVisualRef={autoInkVisualRef} autoPartsVisRef={autoPartsVisRef} NUM_AUTO_PARTS={NUM_AUTO_PARTS} />
             </g>
          </svg>

          {/* 🅱️ TOYOTA LAYERS */}
          <div ref={mainTextRef} className="absolute z-[-999] inset-0 flex items-center justify-center pointer-events-none mt-10">
            <div className="stacked-text flex flex-col items-center uppercase font-black text-[6rem] md:text-[10rem] lg:text-[15rem] leading-none mt-5 tracking-[3rem]">
              <div className="overflow-hidden h-[0.9em] flex items-start "><span className="block text-toyota-red opacity-40" style={{ WebkitTextStroke: "6px #eb0a1e" }}>TOYOTA</span></div>
              <div className="overflow-hidden h-[0.65em] flex items-start opacity-55 -mt-[0.05em] "><span className="block text-transparent opacity-30" style={{ WebkitTextStroke: "3px white" }}>TOY</span><span className="block text-transparent opacity-30" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span></div>
              <div className="overflow-hidden h-[0.45em] flex items-start opacity-50 -mt-[0.05em]"><span className="block text-transparent opacity-25" style={{ WebkitTextStroke: "3px white" }}>TOY</span><span className="block text-transparent opacity-25" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span></div>
              <div className="overflow-hidden h-[0.3em] flex items-start opacity-30 -mt-[0.05em]"><span className="block text-transparent opacity-20" style={{ WebkitTextStroke: "3px white" }}>TOY</span><span className="block text-transparent opacity-20" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span></div>
              <div className="overflow-hidden h-[0.15em] flex items-start opacity-10 -mt-[0.05em]"><span className="block text-transparent" style={{ WebkitTextStroke: "3px #eb0a1e" }}>TOY</span><span className="block text-transparent" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span></div>
            </div>
          </div>

          <CarImagesLayer handleImageEnter={handleImageEnter} handleImageLeave={handleImageLeave} />
        </div>

        {/* 2️⃣ TOP RIGHT MODULE */}
        <div className="absolute top-0 right-0 w-[24%] h-[18%] flex flex-col items-end gap-3 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-toyota-red transition-all cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-toyota-red transition-all cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></button>
              <button className="h-12 px-6 rounded-full bg-white text-black font-black text-xs tracking-widest hover:bg-toyota-red hover:text-white transition-all cursor-pointer">CONTACT</button>
            </div>
            <button onClick={() => gsap.to(window, { duration: 2, scrollTo: "#footer" })} className="w-full h-12 rounded-full border border-white/20 text-white font-black text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all cursor-pointer pointer-events-auto">EXPLORE MODELS</button>
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
               <div className="z-10 self-end bg-toyota-red text-white text-[8px] px-3 py-2 rounded-full font-bold tracking-widest group-hover:bg-white group-hover:text-black transition-colors uppercase">View Specs</div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Hero2;