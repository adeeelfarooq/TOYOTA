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

// 🎯 Brush Trail Engine k Refs (Mouse k liye)
const circlesRef = useRef([]);
const circleIndex = useRef(0);
const NUM_CIRCLES = 30;

// 🎯 Autonomous Ink Blob Refs (Khud chalne wali ink)
const autoInkGroupMaskRef = useRef(null);
const autoInkGroupVisRef = useRef(null);
const autoInkMaskRef = useRef(null);
const autoInkVisualRef = useRef(null);

// 💧 Ink Droplets (Particles) k Refs
const autoPartsMaskRef = useRef([]);
const autoPartsVisRef = useRef([]);
const autoPartIndex = useRef(0);
const NUM_AUTO_PARTS = 20;

// 🚦 Tracking States
const isHoveringCar = useRef(false);
const inkTimerRef = useRef(null); // Timer ink ko wapis lane k liye

useEffect(() => {
const ctx = gsap.context(() => {
const tl = gsap.timeline({ defaults: { force3D: true } });

  gsap.set(bgWrapperRef.current, { opacity: 0 });
  gsap.set(mainTextRef.current, { opacity: 0, y: 50 });
  gsap.set(uiElementsRef.current, { opacity: 0 });

  gsap.set([autoInkMaskRef.current, autoInkVisualRef.current], { x: -500, y: -500 });

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

  // 💧 ADVANCED AUTONOMOUS INK LOGIC
  if (autoInkMaskRef.current && autoInkVisualRef.current && window.innerWidth > 0) {
    let isCenterDash = false;

    function dropParticle() {
      if (Math.random() > 0.4) return; 

      const target = this.targets()[0];
      const currX = gsap.getProperty(target, "x");
      const currY = gsap.getProperty(target, "y");
      
      const idx = autoPartIndex.current;
      const maskPart = autoPartsMaskRef.current[idx];
      const visPart = autoPartsVisRef.current[idx];
      
      if (maskPart && visPart) {
        const offsetX = gsap.utils.random(-80, 80);
        const offsetY = gsap.utils.random(-50, 50);
        const size = gsap.utils.random(20, 60);

        gsap.killTweensOf([maskPart, visPart]);
        
        gsap.set([maskPart, visPart], { 
          x: currX + offsetX, 
          y: currY + offsetY, 
          scale: size,
          opacity: gsap.utils.random(0.6, 1) 
        });
        
        gsap.to([maskPart, visPart], { 
          scale: 0, 
          opacity: 0, 
          duration: gsap.utils.random(0.8, 1.5), 
          ease: "power2.out" 
        });
      }
      autoPartIndex.current = (idx + 1) % NUM_AUTO_PARTS;
    }

    const animateBlob = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      if (!isCenterDash) {
        const newX = gsap.utils.random(-200, w + 200);
        const newY = gsap.utils.random(-200, h + 200);
        const speed = gsap.utils.random(2, 3);
        
        gsap.to([autoInkMaskRef.current, autoInkVisualRef.current], {
          x: newX, y: newY, 
          duration: speed,
          ease: "power1.inOut",
          onUpdate: dropParticle,
          onComplete: () => {
            isCenterDash = true;
            animateBlob(); 
          }
        });
      } else {
        const dashes = Math.floor(gsap.utils.random(2, 4));
        const dashDuration = 1.0 / dashes;
        
        const dashTl = gsap.timeline({
          onComplete: () => {
            isCenterDash = false;
            animateBlob();
          }
        });

        let currentSide = Math.random() > 0.5 ? 1 : -1;

        for (let i = 0; i < dashes; i++) {
          const targetX = currentSide === 1 ? w + 300 : -300;
          const targetY = gsap.utils.random(h * 0.4, h * 0.6);

          dashTl.to([autoInkMaskRef.current, autoInkVisualRef.current], {
            x: targetX, y: targetY, 
            duration: dashDuration,
            ease: "power1.inOut",
            onUpdate: dropParticle
          });
          currentSide *= -1;
        }
      }
    };

    const breatheBlob = () => {
      const newRx = gsap.utils.random(250, 400);
      const newRy = gsap.utils.random(50, 100); 
      gsap.to([autoInkMaskRef.current, autoInkVisualRef.current], {
        attr: { rx: newRx, ry: newRy }, 
        duration: gsap.utils.random(0.5, 1.2), 
        ease: "sine.inOut",
        onComplete: breatheBlob 
      });
    };

    animateBlob();
    breatheBlob();
  }

}, sectionRef);

return () => ctx.revert();

}, []);

// 🎯 Liquid Brush Trail Logic
const handleMouseMove = (e) => {
const { clientX, clientY } = e;

if (!sectionRef.current || !bgWrapperRef.current) return;

// Parallax logic (always runs)
const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
const x = (clientX - left) / width - 0.5;
const y = (clientY - top) / height - 0.5;

gsap.to(".parallax-target", {
  x: x * 30,
  y: y * 20,
  duration: 1,
  ease: "power2.out",
  overwrite: "auto"
});

// 🔴 ONLY RUN THIS IF MOUSE IS ACTUALLY ON CAR (Mask Reveal Logic)
if (isHoveringCar.current) {
  const rect = bgWrapperRef.current.getBoundingClientRect();
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;

  const circle = circlesRef.current[circleIndex.current];
  if (circle) {
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    gsap.killTweensOf(circle);
    gsap.set(circle, { attr: { cx: localX + offsetX, cy: localY + offsetY } });
    gsap.fromTo(circle, { opacity: 1, attr: { r: 0 } }, { attr: { r: Math.random() * 30 + 80 }, duration: 0.2, ease: "power2.out" });
    
    // Note: Circle disappear hone me max ~1.4 sec lagte hain (0.8 delay + 0.6 duration)
    gsap.to(circle, { attr: { r: 0 }, opacity: 0, duration: 0.6, delay: 0.5 + Math.random() * 0.3, ease: "power3.inOut" });
  }
  circleIndex.current = (circleIndex.current + 1) % NUM_CIRCLES;

  // 🔥 LOGIC: Jab tak mask ban raha hai, Auto Ink Hide kardo
  gsap.to([autoInkGroupMaskRef.current, autoInkGroupVisRef.current], {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    overwrite: "auto"
  });

  // 🔥 LOGIC: Agar pehle se timer chal raha hai to cancel kardo
  if (inkTimerRef.current) {
    inkTimerRef.current.kill();
  }

  // 🔥 LOGIC: 1.4 Seconds (jab mask bilkul khtam/disappear ho jaye) baad ink wapis le aao
  inkTimerRef.current = gsap.delayedCall(1.4, () => {
    gsap.to([autoInkGroupMaskRef.current, autoInkGroupVisRef.current], {
      opacity: 1,
      duration: 0.5,
      ease: "power2.inOut",
      overwrite: "auto"
    });
  });
}

};

// Tracking mouse enter/leave just to enable/disable mask generation
const handleImageEnter = () => {
isHoveringCar.current = true;
};

const handleImageLeave = () => {
isHoveringCar.current = false;
};

return (
<section
ref={sectionRef}
className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center p-4 lg:p-6"
onMouseMove={handleMouseMove}
>
<div className="absolute inset-0 bg-black/50 z-0"></div>

{/* 🟢 SVG DEFS */}
  <svg className="absolute w-0 h-0 pointer-events-none">
    <defs>
      <radialGradient id="soft-brush">
        <stop offset="20%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      
      {/* ✅ LANDO NORRIS INSPIRED DEEP LIQUID BLACK INK */}
      <radialGradient id="lando-ink">
        <stop offset="10%" stopColor="#1e1e1e" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#0a0a0a" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* LAG FIX APPLIED FOR EXTREME PERFORMANCE */}
      <filter id="blob-edge" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.005" numOctaves="1" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      
      <mask id="liquid-trail-mask">
        <rect width="100%" height="100%" fill="black" />
        <g filter="url(#blob-edge)">
          <g ref={autoInkGroupMaskRef}>
            <ellipse ref={autoInkMaskRef} cx="0" cy="0" rx="300" ry="80" fill="url(#soft-brush)" className="will-change-transform" />
            {Array.from({ length: NUM_AUTO_PARTS }).map((_, i) => (
              <circle key={`auto-m-${i}`} ref={(el) => (autoPartsMaskRef.current[i] = el)} cx="0" cy="0" r="1" fill="url(#soft-brush)" className="will-change-transform" />
            ))}
          </g>

          {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
            <circle key={i} ref={(el) => (circlesRef.current[i] = el)} cx="0" cy="0" r="1" fill="url(#soft-brush)" className="will-change-transform" />
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
      {/* ✅ VISIBLE LANDO NORRIS STYLE INK */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <g filter="url(#blob-edge)">
           <g ref={autoInkGroupVisRef}>
             <ellipse ref={autoInkVisualRef} cx="0" cy="0" rx="300" ry="80" fill="url(#lando-ink)" className="will-change-transform" />
             {Array.from({ length: NUM_AUTO_PARTS }).map((_, i) => (
                <circle key={`auto-v-${i}`} ref={(el) => (autoPartsVisRef.current[i] = el)} cx="0" cy="0" r="1" fill="url(#lando-ink)" className="will-change-transform" />
             ))}
           </g>
         </g>
      </svg>

      {/* 🅱️ TOYOTA LAYERS */}
      <div ref={mainTextRef} className="absolute z-[-999] inset-0 flex items-center justify-center pointer-events-none mt-10">
        <div className="stacked-text flex flex-col items-center uppercase font-black text-[6rem] md:text-[10rem] lg:text-[15rem] leading-none mt-5 tracking-[3rem]">
          
          <div className="overflow-hidden h-[0.9em] flex items-start ">
            <span className="block text-toyota-red opacity-40" style={{ WebkitTextStroke: "6px #eb0a1e" }}>TOYOTA</span>
          </div>
          
          <div className="overflow-hidden h-[0.65em] flex items-start opacity-55 -mt-[0.05em] ">
            <span className="block text-transparent opacity-30" style={{ WebkitTextStroke: "3px white" }} >TOY</span>
            <span className="block text-transparent opacity-30" style={{ WebkitTextStroke: "3px #eb0a1e" }} >OTA</span>
          </div>
          
          <div className="overflow-hidden h-[0.45em] flex items-start opacity-50 -mt-[0.05em]">
            <span className="block text-transparent opacity-25" style={{ WebkitTextStroke: "3px white"  }}>TOY</span>
            <span className="block text-transparent opacity-25" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span>
          </div>
          
          <div className="overflow-hidden h-[0.3em] flex items-start opacity-30 -mt-[0.05em]">
            <span className="block text-transparent opacity-20" style={{ WebkitTextStroke: "3px white" }}>TOY</span>
            <span className="block text-transparent opacity-20" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span>
          </div>
          
          <div className="overflow-hidden h-[0.15em] flex items-start opacity-10 -mt-[0.05em]">
            <span className="block text-transparent" style={{ WebkitTextStroke: "3px #eb0a1e" }}>TOY</span>
            <span className="block text-transparent" style={{ WebkitTextStroke: "3px #eb0a1e" }}>OTA</span>
          </div>
        </div>
      </div>

      {/* 🏎️ CAR IMAGES LAYER (Properly Wrapped for Mirror Hover and Events) */}
      <div className="absolute inset-0 w-full h-full parallax-target pointer-events-none transform-gpu">
        
        {/* ✨ REFLECTION BASE LAYER (Pointer events none) ✨ */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none -scale-y-100 translate-y-[42%]"
          style={{ WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)", maskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)" }}
        >
          <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover scale-70" alt="Base Reflection" />
        </div>
        
        {/* 🚗 MAIN CAR BASE LAYER (This ALONE catches the Hover events!) */}
        <img 
          src="/images/hero1.png" 
          className="absolute inset-0 w-full h-full object-cover scale-70 pointer-events-auto" 
          alt="Base" 
          onMouseEnter={handleImageEnter}
          onMouseLeave={handleImageLeave}
        />

        {/* ✨ REFLECTION HOVER LAYER (Mirrored Mask logic) ✨ */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none -scale-y-100 translate-y-[42%]"
          style={{ WebkitMaskImage: "url(#liquid-trail-mask)", maskImage: "url(#liquid-trail-mask)" }}
        >
           <div 
             className="absolute inset-0 w-full h-full opacity-40 pointer-events-none transform-gpu"
             style={{ WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)", maskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)" }}
           >
             <img src="/images/spn2.png" className="absolute inset-0 w-full h-full object-cover scale-68 mt-2 -ml-2" alt="Hover Reflection" />
           </div>
        </div>

        {/* 🚗 MAIN CAR HOVER LAYER (Standard Mask logic) */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ WebkitMaskImage: "url(#liquid-trail-mask)", maskImage: "url(#liquid-trail-mask)" }}
        >
           <img src="/images/spn2.png" className="absolute inset-0 w-full h-full object-cover scale-68 mt-2 -ml-2" alt="Hover" />
        </div>

      </div>

    </div>

    {/* 2️⃣ TOP RIGHT MODULE */}
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