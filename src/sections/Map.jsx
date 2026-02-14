import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GlobalMap = () => {

  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const pinsRef = useRef([]);

  useGSAP(() => {

    // 🎯 INITIAL SETUP
    gsap.set(pinsRef.current, {
      scale: 0,
      opacity: 0,
      transformOrigin: "center center"
    });

    // 🗺️ MAP FADE IN
    gsap.from(mapRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "center center",
        scrub: 1,
      }
    });

    // 📍 PINS POP ANIMATION
    gsap.to(pinsRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 40%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      }
    });

  }, []);

  const countries = [
    // North America - Adjusted for better map fit and spacing
    { name: "USA", top: "35%", left: "20%" },
    { name: "Canada", top: "25%", left: "19%" },
    { name: "Mexico", top: "45%", left: "23%" },
    
    // South America - Significantly adjusted UPWARDS to ensure visibility and prevent overlap
    { name: "Brazil", top: "58%", left: "30%" },
    { name: "Argentina", top: "68%", left: "28%" },
    { name: "Colombia", top: "53%", left: "27%" },
    { name: "Peru", top: "58%", left: "26%" },
    { name: "Chile", top: "65%", left: "25%" },
    
    // Europe - Adjusted for better spacing in a dense region
    { name: "UK", top: "28%", left: "46%" },
    { name: "Germany", top: "33%", left: "51%" },
    { name: "France", top: "37%", left: "48%" },
    { name: "Italy", top: "40%", left: "52%" },
    { name: "Spain", top: "40%", left: "44%" },
    { name: "Sweden", top: "22%", left: "54%" },
    { name: "Norway", top: "20%", left: "51%" },
    { name: "Poland", top: "35%", left: "55%" },
    { name: "Ukraine", top: "32%", left: "58%" },
    
    // Asia - Adjusted for better spacing and map fit
    { name: "Pakistan", top: "40%", left: "67%" },
    { name: "India", top: "45%", left: "70%" },
    { name: "China", top: "35%", left: "78%" },
    { name: "Japan", top: "30%", left: "85%" }, // Moved left
    { name: "South Korea", top: "33%", left: "83%" }, // Moved left, slight top adjustment
    { name: "Thailand", top: "48%", left: "76%" },
    { name: "Vietnam", top: "46%", left: "79%" },
    { name: "Malaysia", top: "50%", left: "80%" },
    { name: "Indonesia", top: "55%", left: "81%" }, // Moved up
    { name: "Philippines", top: "50%", left: "85%" }, // Moved up
    
    // Middle East - Adjusted for better spacing
    { name: "UAE", top: "42%", left: "64%" }, // Adjusted left/up
    { name: "Saudi Arabia", top: "45%", left: "59%" }, // Adjusted left
    { name: "Turkey", top: "35%", left: "56%" },
    { name: "Iran", top: "38%", left: "62%" }, // Adjusted left/up
    { name: "Iraq", top: "40%", left: "59%" }, // Adjusted left/up
    
    // Africa - Adjusted for better map fit and spacing
    { name: "Egypt", top: "43%", left: "57%" },
    { name: "Nigeria", top: "50%", left: "50%" },
    { name: "South Africa", top: "68%", left: "55%" }, // Moved up
    { name: "Morocco", top: "40%", left: "45%" },
    { name: "Kenya", top: "57%", left: "54%" }, // Moved up
    { name: "Ethiopia", top: "53%", left: "55%" }, // Moved up
    { name: "Ghana", top: "50%", left: "48%" },
    
    // Australia & Oceania - Significantly adjusted UPWARDS to ensure visibility and prevent overlap
    { name: "Australia", top: "68%", left: "80%" }, // Moved significantly up and left
    { name: "New Zealand", top: "75%", left: "88%" }, // Moved up and left
  ];

  return (
    <section ref={sectionRef} className="relative w-full h-dvh bg-black flex items-center justify-center overflow-hidden">

      {/* 🗺️ MAP IMAGE */}
      <div className="relative w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl mx-auto">
        <img
          ref={mapRef}
          src="/images/Worldmap.png"
          className="w-full h-auto opacity-90"
          alt="World Map"
        />
      </div>

      {/* 📍 PINS WITH COUNTRY NAMES */}
      {countries.map((country, index) => (
        <div
          key={index}
          ref={el => pinsRef.current[index] = el}
          className="absolute flex flex-col items-center"
          style={{
            top: country.top,
            left: country.left,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img
            src="/images/Pin.png"
            className="w-8 md:w-10 lg:w-12 mb-1"
            alt="pin"
          />
          <span className="text-white text-[10px] md:text-xs font-medium bg-black/60 px-2 py-0.5 rounded-full border border-red-500/50 whitespace-nowrap">
            {country.name}
          </span>
        </div>
      ))}

    </section>
  );
};

export default GlobalMap;