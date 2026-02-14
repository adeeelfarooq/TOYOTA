import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GlobalMap = () => {

  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const pinsRef = useRef([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

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
    // North America
    { name: "USA", top: "38%", left: "22%", branches: 12, cities: ["New York", "Los Angeles", "Chicago", "Houston"], info: "North American Headquarters" },
    { name: "Canada", top: "30%", left: "20%", branches: 8, cities: ["Toronto", "Vancouver", "Montreal"], info: "Expanding EV Market" },
    { name: "Mexico", top: "48%", left: "23%", branches: 6, cities: ["Mexico City", "Monterrey"], info: "Manufacturing Hub" },
    
    // South America
    { name: "Brazil", top: "65%", left: "30%", branches: 10, cities: ["São Paulo", "Rio de Janeiro", "Brasília"], info: "Largest Market in SA" },
    { name: "Argentina", top: "73%", left: "28%", branches: 5, cities: ["Buenos Aires", "Córdoba"], info: "Growing Presence" },
    { name: "Colombia", top: "58%", left: "27%", branches: 4, cities: ["Bogotá", "Medellín"], info: "New Market Entry" },
    { name: "Peru", top: "63%", left: "26%", branches: 3, cities: ["Lima"], info: "Emerging Market" },
    { name: "Chile", top: "70%", left: "25%", branches: 4, cities: ["Santiago"], info: "South American Hub" },
    
    // Europe
    { name: "UK", top: "30%", left: "46%", branches: 15, cities: ["London", "Manchester", "Birmingham"], info: "European Headquarters" },
    { name: "Germany", top: "35%", left: "51%", branches: 18, cities: ["Berlin", "Munich", "Hamburg", "Frankfurt"], info: "R&D Center" },
    { name: "France", top: "40%", left: "48%", branches: 9, cities: ["Paris", "Lyon", "Marseille"], info: "Design Studio" },
    { name: "Italy", top: "43%", left: "52%", branches: 7, cities: ["Rome", "Milan", "Turin"], info: "Luxury Division" },
    { name: "Spain", top: "42%", left: "44%", branches: 6, cities: ["Madrid", "Barcelona"], info: "Southern Europe Hub" },
    { name: "Sweden", top: "25%", left: "54%", branches: 5, cities: ["Stockholm"], info: "Scandinavian Hub" },
    { name: "Norway", top: "22%", left: "52%", branches: 4, cities: ["Oslo"], info: "EV Innovation" },
    { name: "Poland", top: "36%", left: "55%", branches: 6, cities: ["Warsaw", "Krakow"], info: "Eastern European Hub" },
    { name: "Ukraine", top: "33%", left: "58%", branches: 3, cities: ["Kyiv"], info: "Growing Market" },
    
    // Asia
    { name: "Pakistan", top: "43%", left: "67%", branches: 25, cities: ["Karachi", "Lahore", "Islamabad", "Faisalabad"], info: "Major Manufacturing Base" },
    { name: "India", top: "47%", left: "72%", branches: 30, cities: ["Delhi", "Mumbai", "Bangalore", "Chennai"], info: "Largest Market in Region" },
    { name: "China", top: "38%", left: "78%", branches: 45, cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"], info: "Global Manufacturing Hub" },
    { name: "Japan", top: "35%", left: "88%", branches: 22, cities: ["Tokyo", "Osaka", "Nagoya"], info: "Technology Center" },
    { name: "South Korea", top: "38%", left: "84%", branches: 12, cities: ["Seoul", "Busan"], info: "Innovation Hub" },
    { name: "Thailand", top: "50%", left: "76%", branches: 8, cities: ["Bangkok", "Chiang Mai"], info: "Production Facility" },
    { name: "Vietnam", top: "48%", left: "79%", branches: 6, cities: ["Hanoi", "Ho Chi Minh City"], info: "Emerging Market" },
    { name: "Malaysia", top: "53%", left: "80%", branches: 7, cities: ["Kuala Lumpur"], info: "Southeast Asian Hub" },
    { name: "Indonesia", top: "60%", left: "81%", branches: 8, cities: ["Jakarta", "Surabaya"], info: "Growing Market" },
    { name: "Philippines", top: "55%", left: "85%", branches: 5, cities: ["Manila"], info: "Expanding Presence" },
    
    // Middle East
    { name: "UAE", top: "45%", left: "62%", branches: 7, cities: ["Dubai", "Abu Dhabi"], info: "Middle East HQ" },
    { name: "Saudi Arabia", top: "48%", left: "60%", branches: 5, cities: ["Riyadh", "Jeddah"], info: "Growing Market" },
    { name: "Turkey", top: "38%", left: "57%", branches: 6, cities: ["Istanbul", "Ankara"], info: "Bridge Between Continents" },
    { name: "Iran", top: "41%", left: "64%", branches: 4, cities: ["Tehran"], info: "Regional Presence" },
    { name: "Iraq", top: "43%", left: "61%", branches: 3, cities: ["Baghdad"], info: "Emerging Market" },
    
    
    // Africa
    { name: "Egypt", top: "45%", left: "57%", branches: 4, cities: ["Cairo", "Alexandria"], info: "North African Hub" },
    { name: "Nigeria", top: "53%", left: "51%", branches: 3, cities: ["Lagos", "Abuja"], info: "West African Market" },
    { name: "South Africa", top: "73%", left: "56%", branches: 8, cities: ["Johannesburg", "Cape Town"], info: "Southern African HQ" },
    { name: "Morocco", top: "42%", left: "46%", branches: 4, cities: ["Casablanca"], info: "North African Presence" },
    { name: "Kenya", top: "60%", left: "54%", branches: 3, cities: ["Nairobi"], info: "East African Hub" },
    { name: "Ethiopia", top: "55%", left: "55%", branches: 2, cities: ["Addis Ababa"], info: "Emerging Market" },
    { name: "Ghana", top: "52%", left: "48%", branches: 2, cities: ["Accra"], info: "West African Presence" },
    
    // Australia
    { name: "Australia", top: "75%", left: "89%", branches: 11, cities: ["Sydney", "Melbourne", "Brisbane"], info: "Oceania Headquarters" },
    { name: "New Zealand", top: "80%", left: "92%", branches: 4, cities: ["Auckland", "Wellington"], info: "Growing Presence" },
  ];

  return (
    <section ref={sectionRef} className="relative w-full h-dvh bg-black flex items-center justify-center overflow-hidden">

      {/* 🗺️ MAP IMAGE */}
      <div className="relative w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl mx-auto">
        <img
          ref={mapRef}
          src="/images/Worldmap.png"
          className="w-full h-auto opacity-90 scale-y-70 bottom-0"
          alt="World Map"
        />
      </div>

      {/* 📍 PINS WITH COUNTRY NAMES */}
      {countries.map((country, index) => (
        <div
          key={index}
          ref={el => pinsRef.current[index] = el}
          className="absolute flex flex-col items-center cursor-pointer"
          style={{
            top: country.top,
            left: country.left,
            transform: 'translate(-50%, -50%)',
            zIndex: hoveredCountry?.name === country.name ? 50 : 10
          }}
          onMouseEnter={() => setHoveredCountry(country)}
          onMouseLeave={() => setHoveredCountry(null)}
        >
          <img
            src="/images/Pin.png"
            className="w-8 md:w-10 lg:w-12 mb-1 transition-transform duration-300 hover:scale-125"
            alt="pin"
          />
          <span className="text-white text-[10px] md:text-xs font-medium bg-black/60 px-2 py-0.5 rounded-full border border-red-500/50 whitespace-nowrap">
            {country.name}
          </span>

          {/* Hover Info Card */}
          {hoveredCountry?.name === country.name && (
            <div 
              className="absolute bg-black/90 backdrop-blur-md rounded-xl border border-red-500/30 p-4 shadow-2xl z-50"
              style={{
                top: 'auto',
                bottom: '120%',
                left: '50%',
                transform: 'translateX(-50%)',
                minWidth: '220px',
              }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-500/30">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-red-500 font-bold text-sm">{country.name}</h3>
              </div>
              
              {/* Card Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-milk-yellow">Branches:</span>
                  <span className="text-white font-bold">{country.branches}+</span>
                </div>
                
                <div className="text-xs">
                  <span className="text-milk-yellow block mb-1">Key Cities:</span>
                  <div className="flex flex-wrap gap-1">
                    {country.cities.map((city, idx) => (
                      <span key={idx} className="bg-red-500/20 text-white px-2 py-0.5 rounded-full text-[10px] border border-red-500/30">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-red-500/30">
                  <span className="text-red-500 text-[10px] font-medium">{country.info}</span>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
            </div>
          )}
        </div>
      ))}

    </section>
  );
};

export default GlobalMap;