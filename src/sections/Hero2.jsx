import { useEffect, useRef } from "react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

function Hero2() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const introLogoRef = useRef(null);

  const bgWrapperRef = useRef(null);
  const turbulenceRef = useRef(null);
  
  // 🎯 Brush Trail Engine k Refs
  const circlesRef = useRef([]); 
  const circleIndex = useRef(0); 
  const NUM_CIRCLES = 50; 

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleSplit = SplitText.create(".title1", { 
        type: "chars",
        charsClass: "transform-gpu will-change-transform" 
      });
      
      const tl = gsap.timeline({ defaults: { force3D: true } });

      gsap.set(bgWrapperRef.current, { opacity: 0 });

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
        .from(titleSplit.chars, { opacity: 0 }, "+=2.6")
        .to(titleSplit.chars, { opacity: 1, yPercent: -20, stagger: 0.09, ease: "power2.out" }, "+=0.8")
        .from(".para", { opacity: 0 })
        .to(".para", { opacity: 1, duration: 1 }, "+=0.8")
        .from(".btn", { opacity: 0 }, "-=0.5") 
        .to(".btn", { opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5");

      // 🌊 CONTINUOUS BUBBLING ANIMATION FOR BRUSH EDGES
      gsap.to(turbulenceRef.current, {
        attr: { baseFrequency: "0.01 0.02" }, 
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
    if (!bgWrapperRef.current) return;
    
    const rect = bgWrapperRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    for (let i = 0; i < 2; i++) {
      const circle = circlesRef.current[circleIndex.current];
      
      if (circle) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;

        gsap.killTweensOf(circle);

        gsap.set(circle, {
          attr: { cx: localX + offsetX, cy: localY + offsetY },
        });

        gsap.fromTo(circle, 
          { attr: { r: 0 }, opacity: 1 },
          { attr: { r: Math.random() * 30 + 80 }, duration: 0.2, ease: "power2.out" }
        );

        gsap.to(circle, {
          attr: { r: 0 }, 
          opacity: 0,
          duration: 0.6, 
          delay: 0.8 + Math.random() * 0.4, 
          ease: "power3.inOut"
        });
      }
      circleIndex.current = (circleIndex.current + 1) % NUM_CIRCLES;
    }
  };

  return (
    <section
      ref={sectionRef}
      // White padding remove kar di hai. Ab sirf main dark background hai.
      className="relative h-screen w-screen bg-[#111111] flex items-center justify-center p-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
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

          {/* 🔥 FIXED SVG PATH: 
              - Left corners (Top aur Bottom) ab bilkul normal rounded hain.
              - Right side cuts ab 75% width se start hongy (pehle 65% thay, isliye early the).
          */}
          <clipPath id="futuristic-cut" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.03, 0 
              L 0.72, 0 
              C 0.74, 0 0.75, 0.02 0.75, 0.05 
              L 0.75, 0.16 
              C 0.75, 0.19 0.76, 0.20 0.78, 0.20 
              L 0.97, 0.20 
              C 0.99, 0.20 1.0, 0.22 1.0, 0.25 
              L 1.0, 0.60 
              C 1.0, 0.63 0.99, 0.65 0.97, 0.65 
              L 0.78, 0.65 
              C 0.76, 0.65 0.75, 0.67 0.75, 0.70 
              L 0.75, 0.95 
              C 0.75, 0.98 0.74, 1.0 0.72, 1.0 
              L 0.03, 1.0 
              C 0.01, 1.0 0, 0.98 0, 0.95 
              L 0, 0.05 
              C 0, 0.02 0.01, 0 0.03, 0 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* 🔴 INTRO RED SCREEN */}
      <div
        ref={introRef}
        className="fixed inset-0 z-[100] bg-toyota-red-soft flex items-center justify-center transform-gpu will-change-transform"
      >
        <img
          ref={introLogoRef}
          src="/images/Toyota-logo.svg"
          alt="Toyota"
          className="w-40 scale-300 transform-gpu"
          style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        />
      </div>

      {/* 🔲 NO WHITE BORDER: Main container now directly uses full space */}
      <div className="relative w-full h-full max-w-[1600px] mx-auto">
        
        {/* 1️⃣ MAIN CLIPPED SECTION */}
        <div 
          ref={bgWrapperRef}
          className="absolute inset-0 w-full h-full bg-black/90 pointer-events-auto shadow-2xl"
          style={{
        
            clipPath: "url(#futuristic-cut)",
            WebkitClipPath: "url(#futuristic-cut)"
          }}
        >
          {/* Base Image */}
          <img 
            src="/images/hero1.png" 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
            alt="Toyota Base" 
          />
          
          {/* Top Image (Liquid Mask Trail) */}
          <img 
            src="/images/spn2.png" 
            className="absolute -translate-x-4 translate-y-3 scale-x-68 scale-70 inset-0 w-full h-full object-cover pointer-events-none will-change-transform" 
            alt="Toyota Helmet Hover" 
            style={{
              WebkitMaskImage: "url(#liquid-trail-mask)",
              maskImage: "url(#liquid-trail-mask)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10" />

          {/* TEXT */}
          <div className="absolute bottom-[5%] left-[5%] z-20 pointer-events-none">
            <h1 className="title1 text-white text-5xl md:text-[5.5rem] leading-[0.9] font-bold uppercase tracking-[-.1vw]">
              Future <br /> 
              <span className="text-toyota-red">Mobility.</span>
            </h1>

            <p className="para mt-4 ml-1 text-gray-300 text-sm md:text-base font-medium max-w-[400px] transform-gpu will-change-opacity uppercase tracking-widest">
              Experience Toyota’s next-generation performance, intelligence and design.
            </p>
          </div>
        </div>

        {/* 2️⃣ TOP RIGHT NOTCH MODULE */}
        <div className="absolute top-0 right-0 w-[24%] h-[18%] flex flex-col justify-between items-end z-20">
           <div className="flex gap-2 w-full justify-end">
              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-toyota-red transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-toyota-red transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </button>
              <button className="flex-1 h-12 rounded-full bg-white/10 flex items-center justify-center text-white px-4 hover:bg-toyota-red transition-colors uppercase text-xs font-bold tracking-widest">
                Contact
              </button>
           </div>
           <button className="w-full h-12 rounded-full bg-white flex items-center justify-center text-black font-bold uppercase tracking-widest hover:bg-toyota-red hover:text-white transition-colors mt-auto text-sm">
              Shop Now
           </button>
        </div>

        {/* 3️⃣ BOTTOM RIGHT NOTCH MODULE (Separate Arrows applied) */}
        <div className="absolute bottom-0 right-0 w-[24%] h-[33%] flex flex-col z-20">
           
           {/* 🔥 FIXED ARROWS: Ab ye right side par hain aur ALAG ALAG buttons hain */}
           <div className="w-full flex justify-end gap-2 mb-3">
              <button className="w-10 h-10 rounded-full bg-black border border-gray-600 flex items-center justify-center text-white hover:border-toyota-red hover:text-toyota-red transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-black border border-gray-600 flex items-center justify-center text-white hover:border-toyota-red hover:text-toyota-red transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
           </div>

           {/* Nested Card */}
           <div className="w-full flex-1 bg-black rounded-3xl overflow-hidden flex flex-col p-3 border border-white/10 group cursor-pointer">
             <div className="flex-1 relative rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-700 text-xs uppercase tracking-widest font-bold z-10">Image</span>
                <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="Sub card" />
             </div>
             <div className="mt-2 text-right">
                <p className="text-white uppercase text-xs font-bold tracking-widest">Aero Kit</p>
                <p className="text-toyota-red text-sm font-bold">$1,250</p>
             </div>
           </div>

        </div>

      </div>
    </section>
  );
}

export default Hero2;