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
  const circlesRef = useRef([]); // Mouse k peechay banne wale circles ka array
  const circleIndex = useRef(0); // Kaunsa circle abhi use karna hai
  const NUM_CIRCLES = 50; // Total circles jo trail banayenge (Zyada = Smooth Brush)

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

  // 🎯 Lando Norris / Framer Style Brush Trail Logic
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Brush ko ghana/thicker banane k liye hum ek move par 2 circles spawn karte hain
    for (let i = 0; i < 2; i++) {
      const circle = circlesRef.current[circleIndex.current];
      
      if (circle) {
        // Liquid paint jaisa unsymmetrical feel dene k liye slight random offset
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;

        // Pehli wali animations ko kill karein
        gsap.killTweensOf(circle);

        // Circle ko mouse ki jagah par lana
        gsap.set(circle, {
          attr: { cx: clientX + offsetX, cy: clientY + offsetY },
        });

        // 1. Pop-in Animation (Brush lagna)
        gsap.fromTo(circle, 
          { attr: { r: 0 }, opacity: 1 },
          { 
            attr: { r: Math.random() * 30 + 80 }, // Radius 80 se 110 px tak random
            duration: 0.2, 
            ease: "power2.out" 
          }
        );

        // 2. Auto-Fade Animation (1 Sec baad Evaporate hona)
        gsap.to(circle, {
          attr: { r: 0 }, // Wapis shrink hona
          opacity: 0,
          duration: 0.6, // Fade hone ki speed
          delay: 0.8 + Math.random() * 0.4, // Lagbhag 1 second baad start hoga
          ease: "power3.inOut"
        });
      }

      // Next circle in the pool
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
          {/* Radial Gradient: Mask ke kinaray naram (soft) karne k liye */}
          <radialGradient id="soft-brush">
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Bubbling Filter: Sirf Mask ki shape par lagay ga, Image par NAHI */}
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
              scale="40" // Bubbles ki intensity
              xChannelSelector="R" 
              yChannelSelector="B" 
            />
          </filter>

          <mask id="liquid-trail-mask">
            {/* Background black = Hidden by default */}
            <rect width="100%" height="100%" fill="black" />
            
            {/* Filter sirf is group par lagay ga jisme hamare brush strokes hain */}
            <g filter="url(#blob-edge)">
              {/* 50 circles jo trail banayenge */}
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

      {/* 🖼️ BACKGROUND & PERFECT BRUSH REVEAL */}
      <div 
        ref={bgWrapperRef}
        className="absolute inset-0 w-full h-full"
      >
        {/* 1. Base Image (Bina Helmet ke) */}
        <img 
          src="/images/hero1.png" 
          className="absolute inset-0 w-full h-full object-cover scale-70 " 
          alt="Toyota Base" 
        />
        
        {/* 2. Top Image (Helmet k sath) - HD RAHAY GI, MASK TRAIL EFFECT K SATH */}
        <img 
          src="/images/spn2.png" 
          className="absolute -translate-x-4 translate-y-3 scale-x-68 scale-70 inset-0 w-full h-full object-cover pointer-events-none will-change-transform" 
          alt="Toyota Helmet Hover" 
          style={{
            WebkitMaskImage: "url(#liquid-trail-mask)",
            maskImage: "url(#liquid-trail-mask)",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />

      {/* TEXT */}
      <div className="absolute top-[8%] left-[28%] z-20 pointer-events-none">
        <h1 className="title1 text-white text-5xl md:text-8xl font-bold uppercase tracking-[-.35vw]">
          Future of <span className="text-toyota-red">Mobility</span>
        </h1>

        <p className="para -mt-2 ml-2 text-gray-200 text-lg font-paragraph transform-gpu will-change-opacity">
          Experience Toyota’s next-generation performance,
          intelligence and design.
        </p>

        <button
          onClick={() => gsap.to(window, { duration: 2, scrollTo: "#msgg" })}
          className="
            btn
            group relative
            px-14 py-3
            mt-95 ml-46
            font-semibold uppercase tracking-[0.2em]
            text-white
            border border-white/40
            rounded-e-full
            transition-all duration-500
            hover:border-toyota-red
            hover:text-black
            hover:cursor-pointer
            z-10
            pointer-events-auto
            transform-gpu will-change-opacity
          "
        >
          <span className="relative z-10">Discover the Drive</span>

          <span
            className="
              shine
              absolute top-0 left-[10%]
              w-[75%] h-full
              bg-gradient-to-r from-transparent via-white/30 to-transparent
              skew-x-[-30deg]
              pointer-events-none
              animate-shine
              z-0
            "
          />

          <span
            className="
              absolute -bottom-2 left-0
              h-[2px] w-0
              bg-toyota-red
              transition-all duration-500
              group-hover:w-full
            "
          />
        </button>
      </div>
    </section>
  );
}

export default Hero2;