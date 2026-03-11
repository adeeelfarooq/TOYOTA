import { useEffect, useRef } from "react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const introRef = useRef(null);
  const introLogoRef = useRef(null);

  // 🎯 Background, SVG Mask Circle, aur Bubbling ke Refs
  const bgWrapperRef = useRef(null);
  const maskCircleRef = useRef(null); // Ab hum is circle ko animate karenge
  const turbulenceRef = useRef(null);
  const timerRef = useRef(null); // 1 second track karne ke liye

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
          {
            opacity: 0,
            clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
          },
          {
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 2,
            ease: "power3.out",
          }
        )
        .to({}, { duration: 1 })
        .to(introRef.current, {
          yPercent: -100,
          duration: 1.4,
          ease: "power4.inOut",
        })
        .to(
          bgWrapperRef.current,
          {
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
          },
          "-=0.7"
        )
        .from(titleSplit.chars, { opacity: 0 }, "+=2.6")
        .to(
          titleSplit.chars,
          {
            opacity: 1,
            yPercent: -20,
            stagger: 0.09,
            ease: "power2.out",
          },
          "+=0.8"
        )
        .from(".para", { opacity: 0 })
        .to(".para", { opacity: 1, duration: 1 }, "+=0.8")
        .from(".btn", { opacity: 0 }, "-=0.5") 
        .to(
          ".btn",
          {
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        );

      // 🌊 CONTINUOUS BUBBLING ANIMATION
      // Ye sirf SVG Mask Shape ko hila raha hai, picture ko nahi
      gsap.to(turbulenceRef.current, {
        attr: { baseFrequency: "0.015 0.025" }, 
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 🎯 Lando Norris Style: Mouse Tracking
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (maskCircleRef.current) {
      // 25vw k hisab se dynamic radius calculate kiya
      const targetRadius = window.innerWidth * 0.25; 

      // 1. Mask Shape (Circle) ko mouse ki jagah par lana aur radius bara karna
      gsap.to(maskCircleRef.current, {
        attr: { cx: clientX, cy: clientY, r: targetRadius },
        duration: 0.5,
        ease: "power3.out",
      });

      // 2. Pehle wala timer cancel karo
      if (timerRef.current) clearTimeout(timerRef.current);

      // 3. 1 SECOND Timer: Mouse rokne k baad radius wapis 0 (gayab) ho jayega
      timerRef.current = setTimeout(() => {
        gsap.to(maskCircleRef.current, {
          attr: { r: 0 }, // Wapis shrink ho k evaporation effect
          duration: 1.2, 
          ease: "power2.inOut",
        });
      }, 1000); 
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (maskCircleRef.current) {
      gsap.to(maskCircleRef.current, {
        attr: { r: 0 },
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen overflow-hidden bg-toyota-red-soft"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🟢 PERFECT SVG MASK ENGINE */}
      <svg className="absolute w-0 h-0">
        <defs>
          {/* Radial Gradient for Soft Edges (Brush jaisa naram edge) */}
          <radialGradient id="soft-brush" cx="50%" cy="50%" r="50%">
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          {/* Bubbling Filter applied ONLY to the Mask, NOT the image */}
          <filter id="blob-edge" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              ref={turbulenceRef} 
              type="fractalNoise" 
              baseFrequency="0.02" 
              numOctaves="3" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="60" /* Bubbling kinaray (edges) kitne rough honge */
              xChannelSelector="R" 
              yChannelSelector="B" 
            />
          </filter>

          <mask id="liquid-mask">
            {/* Ye wo circle hai jo mouse ko follow karega aur animate hoga */}
            <circle 
              ref={maskCircleRef}
              cx="50%" 
              cy="50%" 
              r="0" /* Shuru mein radius 0 hai (hidden) */
              fill="url(#soft-brush)" 
              filter="url(#blob-edge)" 
            />
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

      {/* 🖼️ BACKGROUND & PERFECT LIQUID REVEAL */}
      <div 
        ref={bgWrapperRef}
        className="absolute inset-0 w-full h-full"
      >
        {/* 1. Base Image (Bina Helmet ke) */}
        <img 
          src="/images/hero1.png" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Toyota Base" 
        />
        
        {/* 2. Top Image (Helmet k sath) - ONLY SVG MASK APPLIED HERE */}
        <img 
          src="/images/spn2.png" 
          className="absolute -translate-x-4 translate-y-3 scale-95 inset-0 w-full h-full object-cover pointer-events-none will-change-transform" 
          alt="Toyota Helmet Hover" 
          style={{
            // Yahan humne image par Mask apply kiya hai.
            // Image HD rahegi, sirf mask edge par bubble hoga.
            WebkitMaskImage: "url(#liquid-mask)",
            maskImage: "url(#liquid-mask)",
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

export default Hero;