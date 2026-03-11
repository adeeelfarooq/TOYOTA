import { useEffect, useRef } from "react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const introRef = useRef(null);
  const introLogoRef = useRef(null);

  // Background aur Mask ke liye naye refs
  const bgWrapperRef = useRef(null);
  const maskContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleSplit = SplitText.create(".title1", { 
        type: "chars",
        charsClass: "transform-gpu will-change-transform" 
      });
      
      const tl = gsap.timeline({ defaults: { force3D: true } });

      // Shuru mein background wrapper ko hide rakha hai
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
          // Intro ke baad Background Images show hongi
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 🎯 Lando Norris Style: Mouse Tracking Logic
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    
    // Mouse move hone par mask ki X aur Y position smooth delay k sath update hogi
    if (maskContainerRef.current) {
      gsap.to(maskContainerRef.current, {
        "--x": `${clientX}px`,
        "--y": `${clientY}px`,
        duration: 0.6, // Ye duration usay smooth trail (peechay aane wala) effect deta hai
        ease: "power3.out",
      });
    }
  };

  const handleMouseEnter = (e) => {
    const { clientX, clientY } = e;
    if (maskContainerRef.current) {
      // Shuru mein achanak se darmyan se na aaye, balkay jahan mouse enter ho wahan set ho
      gsap.set(maskContainerRef.current, {
        "--x": `${clientX}px`,
        "--y": `${clientY}px`,
      });
      // Mask ko fade in karna
      gsap.to(maskContainerRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (maskContainerRef.current) {
      // Hover hatne par mask wapis fade out ho jaye
      gsap.to(maskContainerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen overflow-hidden bg-toyota-red-soft"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      {/* 🖼️ Lando Norris Smooth Circular Hover Reveal Effect */}
      <div 
        ref={bgWrapperRef}
        className="absolute inset-0 w-full h-full transform-gpu will-change-opacity"
      >
        {/* 1. Base Image (Bina Helmet ke) */}
        <img 
          src="/images/hero1.png" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Toyota Base" 
        />
        
        {/* 2. Top Image (Helmet k sath) - Soft Mask Overlay */}
        <div 
          ref={maskContainerRef}
          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
          style={{
            // CSS Variables GSAP se control ho rahi hain
            "--x": "50%",
            "--y": "50%",
            // Ye radial gradient ek bada, naram edge wala circle banata hai jo mask ka kaam karta hai
            WebkitMaskImage: "radial-gradient(circle 30vw at var(--x) var(--y), black 0%, rgba(0,0,0,0.8) 20%, transparent 60%)",
            maskImage: "radial-gradient(circle 30vw at var(--x) var(--y), black 0%, rgba(0,0,0,0.8) 20%, transparent 60%)",
            opacity: 0, // Shuru mein mask hidden hai
          }}
        >
          <img 
            src="/images/spn2.png" 
            className="w-full h-full object-cover" 
            alt="Toyota Helmet Hover" 
          />
        </div>
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