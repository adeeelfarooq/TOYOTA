import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const GlobalMap = () => {

  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const pinsRef = useRef([]);
  const headingsRef = useRef(null); // Ref for the new headings container
  const subheadingRef = useRef(null); // Ref for the subheading
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useGSAP(() => {

    // 🎯 INITIAL SETUP
    gsap.set(pinsRef.current, {
      scale: 0,
      opacity: 0,
      transformOrigin: "center center"
    });

    // New: Initial setup for headings
    gsap.set([headingsRef.current], {
      y: 50, // Start slightly below
      opacity: 0,
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

    // New: Headings animation
    gsap.to(headingsRef.current, {
        y: 0, // Animate to original position
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%", // Trigger slightly before map fade in
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
    { name: "Chile", top: "75%", left: "26%", branches: 4, cities: ["Santiago"], info: "South American Hub" },
    
    // Europe
    { name: "UK", top: "34%", left: "45%", branches: 15, cities: ["London", "Manchester", "Birmingham"], info: "European Headquarters" },
    { name: "Germany", top: "35%", left: "51%", branches: 18, cities: ["Berlin", "Munich", "Hamburg", "Frankfurt"], info: "R&D Center" },
    { name: "France", top: "40%", left: "48%", branches: 9, cities: ["Paris", "Lyon", "Marseille"], info: "Design Studio" },
    { name: "Italy", top: "43%", left: "52%", branches: 7, cities: ["Rome", "Milan", "Turin"], info: "Luxury Division" },
    { name: "Spain", top: "42%", left: "44%", branches: 6, cities: ["Madrid", "Barcelona"], info: "Southern Europe Hub" },
    { name: "Sweden", top: "25%", left: "54%", branches: 5, cities: ["Stockholm"], info: "Scandinavian Hub" },
    { name: "Norway", top: "30%", left: "52%", branches: 4, cities: ["Oslo"], info: "EV Innovation" },
    { name: "Poland", top: "36%", left: "54%", branches: 6, cities: ["Warsaw", "Krakow"], info: "Eastern European Hub" },
    { name: "Ukraine", top: "33%", left: "58%", branches: 3, cities: ["Kyiv"], info: "Growing Market" },
    
    // Eastern Europe / Caucasus (New Countries - Ukraine ke right side)
    { name: "Romania", top: "32%", left: "80%", branches: 4, cities: ["Bucharest"], info: "Emerging European Market" },
    { name: "Bulgaria", top: "28%", left: "62%", branches: 3, cities: ["Sofia"], info: "Balkan Presence" },
    { name: "Greece", top: "44%", left: "71%", branches: 5, cities: ["Athens", "Thessaloniki"], info: "Mediterranean Hub" },
    { name: "Georgia", top: "30%", left: "65%", branches: 2, cities: ["Tbilisi"], info: "Caucasus Region" },
    { name: "Azerbaijan", top: "27%", left: "76%", branches: 2, cities: ["Baku"], info: "Caspian Market" },
    { name: "Armenia", top: "37%", left: "62%", branches: 2, cities: ["Yerevan"], info: "Emerging Market" },
    { name: "Kazakhstan", top: "32%", left: "68%", branches: 5, cities: ["Almaty", "Nur-Sultan"], info: "Central Asian Hub" },
    { name: "Uzbekistan", top: "35%", left: "70%", branches: 3, cities: ["Tashkent"], info: "Growing Presence" },
    { name: "Turkmenistan", top: "40%", left: "75%", branches: 2, cities: ["Ashgabat"], info: "Emerging Market" },
    { name: "Kyrgyzstan", top: "30%", left: "73%", branches: 2, cities: ["Bishkek"], info: "Central Asian Presence" },
    
    // Asia
    { name: "Pakistan", top: "43%", left: "67%", branches: 25, cities: ["Karachi", "Lahore", "Islamabad", "Faisalabad"], info: "Major Manufacturing Base" },
    { name: "India", top: "49%", left: "72%", branches: 30, cities: ["Delhi", "Mumbai", "Bangalore", "Chennai"], info: "Largest Market in Region" },
    { name: "China", top: "38%", left: "78%", branches: 45, cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"], info: "Global Manufacturing Hub" },
    { name: "Japan", top: "35%", left: "89%", branches: 22, cities: ["Tokyo", "Osaka", "Nagoya"], info: "Technology Center" },
    { name: "South Korea", top: "38%", left: "84%", branches: 12, cities: ["Seoul", "Busan"], info: "Innovation Hub" },
    { name: "Thailand", top: "50%", left: "76%", branches: 8, cities: ["Bangkok", "Chiang Mai"], info: "Production Facility" },
    { name: "Vietnam", top: "48%", left: "79%", branches: 6, cities: ["Hanoi", "Ho Chi Minh City"], info: "Emerging Market" },
    { name: "Malaysia", top: "53%", left: "80%", branches: 7, cities: ["Kuala Lumpur"], info: "Southeast Asian Hub" },
    { name: "Indonesia", top: "62%", left: "80%", branches: 8, cities: ["Jakarta", "Surabaya"], info: "Growing Market" },
    { name: "Philippines", top: "55%", left: "83%", branches: 5, cities: ["Manila"], info: "Expanding Presence" },
    
    // Middle East
    { name: "UAE", top: "45%", left: "62%", branches: 7, cities: ["Dubai", "Abu Dhabi"], info: "Middle East HQ" },
    { name: "Saudi Arabia", top: "50%", left: "59%", branches: 5, cities: ["Riyadh", "Jeddah"], info: "Growing Market" },
    { name: "Turkey", top: "38%", left: "57%", branches: 6, cities: ["Istanbul", "Ankara"], info: "Bridge Between Continents" },
    { name: "Iran", top: "41%", left: "64%", branches: 4, cities: ["Tehran"], info: "Regional Presence" },
    { name: "Iraq", top: "42%", left: "60%", branches: 3, cities: ["Baghdad"], info: "Emerging Market" },
    
    
    // Africa
    { name: "Egypt", top: "47%", left: "57%", branches: 4, cities: ["Cairo", "Alexandria"], info: "North African Hub" },
    { name: "Nigeria", top: "53%", left: "51%", branches: 3, cities: ["Lagos", "Abuja"], info: "West African Market" },
    { name: "South Africa", top: "73%", left: "56%", branches: 8, cities: ["Johannesburg", "Cape Town"], info: "Southern African HQ" },
    { name: "Morocco", top: "46%", left: "46%", branches: 4, cities: ["Casablanca"], info: "North African Presence" },
    { name: "Kenya", top: "59%", left: "54%", branches: 3, cities: ["Nairobi"], info: "East African Hub" },
    { name: "Ethiopia", top: "55%", left: "55%", branches: 2, cities: ["Addis Ababa"], info: "Emerging Market" },
    { name: "Ghana", top: "55%", left: "48%", branches: 2, cities: ["Accra"], info: "West African Presence" },
    
    // Australia
    { name: "Australia", top: "75%", left: "89%", branches: 11, cities: ["Sydney", "Melbourne", "Brisbane"], info: "Oceania Headquarters" },
    { name: "New Zealand", top: "78%", left: "95%", branches: 4, cities: ["Auckland", "Wellington"], info: "Growing Presence" },
  ];

  return (
    <section ref={sectionRef} className="relative w-full h-dvh bg-black flex items-center justify-center overflow-hidden">

      {/* NEW: Headings Section */}
      {/* 🟥 STACKED HEADING */}
{/* 🟥 HEADING + GLOBE ROW */}
<div
  ref={headingsRef}
  className="absolute top-[5%] left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl flex items-center justify-between "
>

  {/* LEFT SIDE STACKED TEXT */}
  <div className="stacked-text flex flex-col uppercase font-bold text-[4rem] md:text-[4rem] leading-none text-white ml-70"
    style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
  >

    <div className="overflow-hidden  h-[0.9em] flex items-end">
      <span className="block whitespace-nowrap">WE  <span className="text-toyota-red"> ARE EVERYWHERE</span></span>
    </div>

    <div className="overflow-hidden h-[0.5em] flex items-end opacity-80 text-white">
      <span className="block whitespace-nowrap">WE  <span className="text-toyota-red opacity-80"> ARE EVERYWHERE</span></span>
    </div>

    <div className="overflow-hidden h-[0.4em] flex items-end opacity-60 text-white">
      <span className="block whitespace-nowrap">WE  <span className="text-toyota-red opacity-60"> ARE EVERYWHERE</span></span>
    </div>

    <div className="overflow-hidden h-[0.3em] flex items-end opacity-40 text-white">
      <span className="block whitespace-nowrap">WE  <span className="text-toyota-red opacity-40"> ARE EVERYWHERE</span></span>
    </div>

    <div className="overflow-hidden h-[0.2em] flex items-end opacity-20 text-white">
      <span className="block whitespace-nowrap">WE  <span className="text-toyota-red opacity-35"> ARE EVERYWHERE</span></span>
    </div>

  </div>

  {/* 🌍 RIGHT SIDE GLOBE */}
  <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center scale-80 -mt-7 ">

    {/* ROTATING TEXT */}
    <svg className="absolute w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 200 200">
      <defs>
        <path
          id="circlePath"
          d="M 100, 100
             m -80, 0
             a 80,80 0 1,1 160,0
             a 80,80 0 1,1 -160,0"
        />
      </defs>

      <text fill="#eb0a1e" fontSize="10" fontWeight="bold" letterSpacing="2">
        <textPath href="#circlePath" startOffset="0%">
          OVER IN 170+ COUNTRIES • OVER IN 170+ COUNTRIES • OVER IN 170+ COUNTRIES •
        </textPath>
      </text>
    </svg>

    {/* GLOBE IMAGE */}
    <img
      src="/images/Globe.png"
      className="w-[70%] h-[70%] object-contain "
      alt="globe"
      
    />

  </div>

</div>




      {/* 🗺️ MAP IMAGE */}
      <div className="relative w-[95%] md:w-[90%] lg:w-[85%] max-w-7xl mx-auto bottom-[-17%] scale-x-120 ">
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
          className="absolute flex flex-col items-center cursor-pointer mt-25   "
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
            className="w-8 md:w-10 lg:w-12 mb-1 transition-transform duration-300 scale-130 hover:scale-155  "
            alt="pin"
          />
          <span className="text-white text-[10px] md:text-xs uppercase bg-black/60 px-2 py-0.5 rounded-full border border-red-500/50 whitespace-nowrap">
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
                <div className="w-2 h-2 bg-red-500 rounded-full "></div>
                <h3 className="text-red-500 uppercase font-bold text-sm">{country.name}</h3>
              </div>
              
              {/* Card Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white">Branches:</span>
                  <span className="text-milk-yellow font-bold">{country.branches}+</span>
                </div>
                
                <div className="text-xs">
                  <span className="text-white block mb-1">Key Cities:</span>
                  <div className="flex flex-wrap gap-1">
                    {country.cities.map((city, idx) => (
                      <span key={idx} className="bg-red-500/20 text-milk-yellow px-2 py-0.5 rounded-full text-[10px] border border-red-500/30">
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
