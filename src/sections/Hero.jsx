import { useEffect, useRef } from "react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const logoRef = useRef(null);
  const introRef = useRef(null);
  const introLogoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleSplit = SplitText.create(".title1", { type: "chars" });
      const tl = gsap.timeline();

      gsap.set(videoRef.current, { opacity: 0 });

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
          videoRef.current,
          {
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            onStart: () => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            },
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
        .to(
          logoRef.current,
          {
            scale: 1,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.2,
            ease: "power2.inOut",
          },
          "-=2.0"
        )
        .from(".btn", { opacity: 0 })
        .to(
          ".btn",
          {
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=2.0"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen overflow-hidden bg-toyota-red-soft"
    >
      {/* 🔴 INTRO RED SCREEN */}
      <div
        ref={introRef}
        className="fixed inset-0 z-50 bg-toyota-red-soft flex items-center justify-center"
      >
        <img
          ref={introLogoRef}
          src="/images/Toyota-logo.svg"
          alt="Toyota"
          className="w-40 scale-300 -translate-y-50"
          style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
        />
      </div>

      {/* 🎥 VIDEO */}
      <video
        ref={videoRef}
        src="/videos/Toyota-Video.mp4"
        muted
        playsInline
        preload="none"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      {/* 🔴 HEADER LOGO */}
      <img
        ref={logoRef}
        src="/images/Toyota-logo.svg"
        alt="Toyota"
        className="absolute top-6 left-8 z-20 w-32"
        style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
      />

      {/* TEXT */}
      <div className="absolute top-[8%] left-[28%] z-10">
        <h1 className="title1 text-white text-5xl md:text-8xl font-bold uppercase tracking-[-.35vw]">
          Future of <span className="text-toyota-red">Mobility</span>
        </h1>

        <p className="para -mt-2 ml-2 text-gray-200 text-lg font-paragraph">
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
