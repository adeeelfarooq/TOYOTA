import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GlobalMap = () => {

  const sectionRef = useRef(null);

  useGSAP(() => {

    // 🔴 PIN POP ANIMATION
    gsap.from(".map-pin", {
      scale: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        scrub: 1,
      }
    });

    // 🔴 SVG LINE DRAW ANIMATION
    const lines = document.querySelectorAll(".map-line");

    lines.forEach((line) => {

      const length = line.getTotalLength();

      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length
      });

      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          end: "bottom center",
          scrub: 1
        }
      });

    });

  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-dvh bg-black flex items-center justify-center overflow-hidden">

      {/* 🌍 MAP IMAGE */}
      <img
        src="/images/Worldmap.png"
        className="absolute w-[80%] opacity-80 items-center "
        alt=""
      />

      {/* 📍 PINS */}
      <img src="/images/Pin.png" className="map-pin absolute w-36 top-[55%] left-[62%]" />
      <img src="/images/Pin.png" className="map-pin absolute w-36 top-[40%] left-[82%]" />
      <img src="/images/Pin.png" className="map-pin absolute w-36 top-[58%] left-[69%]" />

      {/* 🔴 SVG CONNECTION LINES */}
      <svg className="absolute top-0 left-0 w-full h-full">

        {/* Pakistan ➝ Japan */}
        <path
          className="map-line"
          d="M750 400 Q1100 150 1300 300"
          stroke="#ff0000"
          strokeWidth="2"
          fill="transparent"
        />

        {/* Pakistan ➝ Germany */}
        <path
          className="map-line"
          d="M750 400 Q850 200 950 280"
          stroke="#ff0000"
          strokeWidth="2"
          fill="transparent"
        />

      </svg>

    </section>
  );
};

export default GlobalMap;
