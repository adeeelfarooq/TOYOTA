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
        
        // Intro k baad Base background + Images show hongi
        .to(bgWrapperRef.current, { opacity: 1, duration: 1.5, ease: "power4.out" }, "-=0.7")
        
        // Modern UI aur Flowing Text ka entrance
        .to(mainTextRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }, "-=1.0")
        .to(uiElementsRef.current, { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=1.0");

      // 🌊 CONTINUOUS BUBBLING ANIMATION FOR BRUSH EDGES
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
    
    // 🖱️ Image move effect on hover - Yeh naya add kiya hai
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    gsap.to(bgWrapperRef.current, {
      x: x * 30,  // 30 pixels left/right movement
      y: y * 20,  // 20 pixels up/down movement
      duration: 1,
      ease: "power2.out"
    });

    // Brush trail logic (yeh pehle se tha)
    for (let i = 0; i < 2; i++) {
      const circle = circlesRef.current[circleIndex.current];
      
      if (circle) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;

        gsap.killTweensOf(circle);

        gsap.set(circle, {
          attr: { cx: clientX + offsetX, cy: clientY + offsetY },
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
      className="relative h-screen w-screen overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* 🟢 PERFECT SVG MASK TRAIL ENGINE */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <radialGradient id="soft-brush">
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <filter id="blob-edge" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              ref={turbulenceRef} 
              type="fractalNoise" 
              baseFrequency="0.015" 
              numOctaves="3" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="40" 
              xChannelSelector="R" 
              yChannelSelector="B" 
            />
          </filter>

          <mask id="liquid-trail-mask">
            <rect width="100%" height="100%" fill="black" />
            <g filter="url(#blob-edge)">
              {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => (circlesRef.current[i] = el)}
                  cx="0"
                  cy="0"
                  r="0"
                  fill="url(#soft-brush)"
                />
              ))}
            </g>
          </mask>
        </defs>
      </svg>

      {/* 🔴 INTRO RED SCREEN */}
      <div
        ref={introRef}
        className="absolute inset-0 z-[100] bg-toyota-red-soft flex items-center justify-center transform-gpu will-change-transform"
      >
        <img
          ref={introLogoRef}
          src="/images/Toyota-logo.svg"
          alt="Toyota"
          className="w-40 scale-300 transform-gpu"
          style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        />
      </div>

      {/* 🅱️ BIG CASCADING TOYOTA TEXT (Background Me) */}
      <div 
        ref={mainTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transform-gpu will-change-transform mt-10"
      >
        <div className="stacked-text flex flex-col items-center uppercase font-black text-[6rem] md:text-[10rem] lg:text-[15rem] leading-none tracking-tighter"
          style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
        >
          {/* Main Solid Text (Top) - Ab yeh mukammal red hai */}
          <div className="overflow-hidden h-[0.9em] flex items-start">
            <span className="block whitespace-nowrap text-toyota-red">TOYOTA</span>
          </div>

          {/* Layer 1 (Cut) */}
          <div className="overflow-hidden h-[0.65em] flex items-start opacity-80 -mt-[0.05em]">
            <span className="block whitespace-nowrap text-transparent" style={{ WebkitTextStroke: "2px white" }}>
              TOY<span className="text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
            </span>
          </div>

          {/* Layer 2 (Cut) */}
          <div className="overflow-hidden h-[0.45em] flex items-start opacity-50 -mt-[0.05em]">
            <span className="block whitespace-nowrap text-transparent" style={{ WebkitTextStroke: "2px white" }}>
              TOY<span className="text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
            </span>
          </div>

          {/* Layer 3 (Cut) */}
          <div className="overflow-hidden h-[0.3em] flex items-start opacity-30 -mt-[0.05em]">
            <span className="block whitespace-nowrap text-transparent" style={{ WebkitTextStroke: "2px white" }}>
              TOY<span className="text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
            </span>
          </div>

          {/* Layer 4 (Cut) */}
          <div className="overflow-hidden h-[0.15em] flex items-start opacity-10 -mt-[0.05em]">
            <span className="block whitespace-nowrap text-transparent" style={{ WebkitTextStroke: "2px white" }}>
              TOY<span className="text-transparent" style={{ WebkitTextStroke: "2px #eb0a1e" }}>OTA</span>
            </span>
          </div>
        </div>
      </div>

      {/* 🖼️ CAR IMAGES LAYER (Text k Upar hogi, Trail Mask k sath) */}
      <div 
        ref={bgWrapperRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none will-change-transform"
      >
        {/* 1. Base Image (Bina Helmet/Car k) */}
        <img 
          src="/images/hero1.png" 
          className="absolute inset-0 w-full h-full object-cover scale-70 drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" 
          alt="Toyota Base" 
        />
        
        {/* 2. Top Image (Hover wali Car) - MASK TRAIL EFFECT K SATH */}
        <img 
          src="/images/spn2.png" 
          className="absolute -translate-x-4 translate-y-3 scale-x-68 scale-70 inset-0 w-full h-full object-cover pointer-events-none will-change-transform" 
          alt="Toyota Hover" 
          style={{
            WebkitMaskImage: "url(#liquid-trail-mask)",
            maskImage: "url(#liquid-trail-mask)",
          }}
        />
      </div>

      {/* 💻 MODERN UI ELEMENTS (Overlays) */}
      <div ref={uiElementsRef} className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Bottom Right CTA Button (Baki sab remove kar diya) */}
        <div className="absolute bottom-10 right-10 pointer-events-auto">
          <button
            onClick={() => gsap.to(window, { duration: 2, scrollTo: "#msgg" })}
            className="group flex items-center gap-4 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-500"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Explore Models</span>
            <div className="w-6 h-6 rounded-full bg-toyota-red flex items-center justify-center group-hover:bg-black transition-colors">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero2;