import { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import CarCards from "../components/Carcards";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const carsData = [
  { id: 1, title: "Supra GR", type: "Sports", image: "/images/Supra.png", video: "/videos/Supra-2020.mp4" },
  { id: 2, title: "Toyota 4Runner", type: "SUV", image: "/images/4Runner.png", video: "/videos/4Runner.mp4" },
  { id: 3, title: "Toyota Prius", type: "Sedan", image: "/images/prius-Photoroom.png", video: "/videos/Prius2025.mp4" },
  { id: 4, title: "Toyota Prado", type: "SUV", image: "/images/Prado.png", video: "/videos/PRADO.mp4" },
  { id: 5, title: "Toyota Camry", type: "Sedan", image: "/images/Camry.png", video: "/videos/Camry.mp4" },
  { id: 6, title: "Supra MK", type: "Sports", image: "/images/Supra-old1.png", video: "/videos/Supra-Mk4.mp4" },
  { id: 7, title: "Toyota 2000", type: "Sports", image: "/images/2000gt-supra.png", video: "/videos/GT2000.mp4" },
  { id: 8, title: "Toyota V8", type: "SUV", image: "/images/V8.png", video: "/videos/Land-V8.mp4" },
];

const filters = ["All", "SUV", "Sedan", "Sports"];

export default function Cars() {
  const [active, setActive] = useState("All");
  const cardsWrapperRef = useRef(null);
  const cardsRowRef = useRef(null);
  const splitTextRef = useRef(null);
  const isFirstRender = useRef(true);

  // Filter cars based on active filter using useMemo
  const filteredCars = useMemo(() => {
    return active === "All" ? carsData : carsData.filter(c => c.type === active);
  }, [active]);

  useGSAP(() => {
    // First cleanup on every dependency change
    if (splitTextRef.current) {
      splitTextRef.current.revert();
      splitTextRef.current = null;
    }
    
    // Kill all ScrollTriggers from this component only
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger?.closest('.carsmodels') || 
          trigger.trigger?.closest('.cars-section')) {
        trigger.kill();
      }
    });

    const wrapper = cardsWrapperRef.current;
    const row = cardsRowRef.current;

    if (!wrapper || !row) return;

    // Calculate scroll distance based on current filtered cars
    const totalWidth = row.scrollWidth;
    const viewport = window.innerWidth;
    const scrollDistance = Math.max(0, totalWidth - viewport + 434);

    // Recreate SplitText
    splitTextRef.current = new SplitText(".first-message", {
      type: "words",
      wordsClass: "word-item"
    });

    // ---------------------------------------------------------
    // 🔥 1. HEADER ANIMATION - Word by Word Highlight
    // ---------------------------------------------------------
    const words = gsap.utils.toArray(".first-message .word-item");
    
    gsap.set(words, { 
      color: "#666",
      opacity: 0.7
    });

    words.forEach((word, i) => {
      gsap.to(word, {
        color: "#ffffff",
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".first-message",
          start: `top+=${i * 50} 65%`,
          end: `top+=${i * 50 + 50} 100%`,
          scrub: 1,
          toggleActions: "play none none reverse",
          markers: false
        }
      });
    });

    // ---------------------------------------------------------
    // 🔥 2. JOURNEY REVEAL ANIMATION
    // ---------------------------------------------------------
    gsap.to(".journey-container", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "circ.inOut",
      scrollTrigger: {
        trigger: ".journey-container",
        start: "top 50%",
        end: "top 10%",
        scrub: true,
        toggleActions: "play none none reverse",
        markers: false
      }
    });

    // ---------------------------------------------------------
    // 🚙 3. HORIZONTAL SCROLL LOGIC
    // ---------------------------------------------------------
    // Only create horizontal scroll animation if there are cars to show
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

    // Force refresh ScrollTrigger after animations are set up
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [active]); // Only depend on active, not filteredCars

  // Force ScrollTrigger refresh when filtered cars change
  useEffect(() => {
    if (!isFirstRender.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    } else {
      isFirstRender.current = false;
    }
  }, [filteredCars]);

  return (
    <section className="bg-black text-white px-14 py-25 overflow-hidden carsmodels cars-section">
      {/* ✅ HEADER */}
      <div className="flex items-end justify-between -mb-16 msgs">
        <h1 
          className="text-7xl font-sans first-message origin-bottom-left"
        >
          EXPLORE MODELS
        </h1>

        <h2 className="text-2xl font-paragraph first-message max-w-xl -ml-200 px-210 -translate-y-12 leading-5 tracking-widest">
          Crafted For Every
        </h2>

        {/* ✅ Journey text aur logo ko ek container mein wrap kiya */}
        <div 
          className="journey-container flex items-center -translate-y-4 -translate-x-210"
          style={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
        >
          <h2 
            className="journey font-sans text-gray-950 bg-toyota-red text-2xl flex items-center w-30"
          >
            Journey
          </h2>
          <img 
            src="/images/Toyota-logo1.png" 
            className="-ml-3 w-8" 
            alt="Toyota Logo" 
          />
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

      {/* ✅ ONLY THIS PART SCROLLS */}
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