import { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import CarCards from "../components/Carcards";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const carsData = [
  { id: 1, title: "Supra GR", type: "Sports", image: "/images/Supra.png", video: "/videos/Supra-2020.webm" },
  { id: 2, title: "Toyota 4Runner", type: "SUV", image: "/images/4Runner.png", video: "/videos/4Runner.webm" },
  { id: 3, title: "Toyota Prius", type: "Sedan", image: "/images/prius-Photoroom.png", video: "/videos/Prius2025.webm" },
  { id: 4, title: "Toyota Prado", type: "SUV", image: "/images/Prado.png", video: "/videos/PRADO.webm" },
  { id: 5, title: "Toyota Camry", type: "Sedan", image: "/images/Camry.png", video: "/videos/Camry.webm" },
  { id: 6, title: "Supra MK", type: "Sports", image: "/images/Supra-old1.png", video: "/videos/Supra-Mk4.webm" },
  { id: 7, title: "Toyota 2000", type: "Sports", image: "/images/2000gt-supra.png", video: "/videos/GT2000.webm" },
  { id: 8, title: "Toyota V8", type: "SUV", image: "/images/V8.png", video: "/videos/Land-V8.webm" },
];

const filters = ["All", "SUV", "Sedan", "Sports"];

export default function Cars() {
  const [active, setActive] = useState("All");
  const cardsWrapperRef = useRef(null);
  const cardsRowRef = useRef(null);
  const splitTextRef = useRef(null);
  const isFirstRender = useRef(true);

  const filteredCars = useMemo(() => {
    return active === "All" ? carsData : carsData.filter(c => c.type === active);
  }, [active]);

  useGSAP(() => {
    if (splitTextRef.current) {
      splitTextRef.current.revert();
      splitTextRef.current = null;
    }

    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger?.closest(".carsmodels") || t.trigger?.closest(".cars-section")) t.kill();
    });

    const wrapper = cardsWrapperRef.current;
    const row = cardsRowRef.current;
    if (!wrapper || !row) return;

    const totalWidth = row.scrollWidth;
    const scrollDistance = Math.max(0, totalWidth - window.innerWidth + 434);

    // SplitText for header
    splitTextRef.current = new SplitText(".first-message", {
      type: "words",
      wordsClass: "word-item",
    });

    const words = gsap.utils.toArray(".first-message .word-item");
    gsap.set(words, { color: "#666", opacity: 0.7 });

    words.forEach((word, i) => {
      gsap.to(word, {
        color: "#fff",
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".first-message",
          start: `top+=${i * 50} 65%`,
          end: `top+=${i * 50 + 50} 100%`,
          scrub: 1,
        },
      });
    });

    // Journey reveal
    gsap.to(".journey-container", {
      clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
      ease: "circ.inOut",
      scrollTrigger: {
        trigger: ".journey-container",
        start: "top 50%",
        end: "top 10%",
        scrub: true,
      },
    });

    // Horizontal scroll
    if (filteredCars.length > 0 && scrollDistance > 0) {
      gsap.to(row, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [active]);

  // Refresh scrolltrigger on filtered cars update
  useEffect(() => {
    if (!isFirstRender.current) {
      setTimeout(() => ScrollTrigger.refresh(), 150);
    } else {
      isFirstRender.current = false;
    }
  }, [filteredCars]);

  return (
    <section className="bg-black text-white px-14 py-25 overflow-hidden carsmodels cars-section">
      <div className="flex items-end justify-between -mb-16 msgs">
        <h1 className="text-7xl font-sans first-message origin-bottom-left">
          EXPLORE MODELS
        </h1>

        <h2 className="text-2xl font-paragraph first-message max-w-xl -ml-200 px-210 -translate-y-12 leading-5 tracking-widest">
          Crafted For Every
        </h2>

        <div 
          className="journey-container flex items-center -translate-y-4 -translate-x-210"
          style={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
        >
          <h2 className="journey font-sans text-gray-950 bg-toyota-red text-2xl flex items-center w-30">
            Journey
          </h2>
          <img src="/images/Toyota-logo1.png" className="-ml-3 w-8" alt="Toyota Logo" />
        </div>

        <div className="flex gap-6">
          {filters.map(item => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`
                uppercase text-xs tracking-widest pb-1 px-4 -translate-x-45
                border-b transition-all z-100
                ${active === item
                  ? "border-toyota-red text-white"
                  : "border-transparent text-gray-400 hover:text-white"}
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal cards scroll */}
      <div ref={cardsWrapperRef} className="relative h-screen">
        <div
          ref={cardsRowRef}
          className="absolute top-1/2 -translate-y-1/2 flex gap-28 w-max"
        >
          {filteredCars.map(car => (
            <CarCards key={car.id} {...car} />
          ))}
        </div>
      </div>
    </section>
  );
}
