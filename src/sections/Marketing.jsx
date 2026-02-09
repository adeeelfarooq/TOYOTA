import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const videoVariants = [
  {
    video: "/videos/Car-on-road_1.webm",
    title: "URBAN",
    subtitle: "City Performance",
    stats: ["8.5″ Clearance", "4×4 System", "38° Angle"]
  },
  {
    video: "/videos/Suv-forest_1.webm",
    title: "ADVENTURE",
    subtitle: "Off-Road Capability",
    stats: ["9.2″ Clearance", "AWD System", "42° Angle"]
  },
  {
    video: "/videos/Tacoma-mountain_1.webm",
    title: "EXTREME",
    subtitle: "Mountain Terrain",
    stats: ["10.6″ Clearance", "4×4 Lock", "45° Angle"]
  }
];

export default function TerrainSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const videosRef = useRef([]);
  const tacoVideoRef = useRef(null);

  useGSAP(() => {
    const firstF = SplitText.create(".first-text ", { type: "chars" });
    const thirdF = SplitText.create(".third ", { type: "chars" });
    

 

  // 1️⃣ Designed to dominate
  gsap.to(".designed-dominate", {
    clipPath:"polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
    ease: "circ.out",
    duration: 8,
    opacity:1,
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "290% bottom",   
      end: "335% bottom",
      scrub: 1.5,
    
    }
  });

  // 2️⃣ Streets | Forests | Pinnacle
  gsap.to(".terrain-tags", {
    clipPath:"polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
    ease: "circ.out",
    duration: 8,
    opacity: 1,
    scrollTrigger: {
      
      trigger: sectionRef.current,
      
      start: "295% bottom",   
      end: "340% bottom",
      scrub: 1.5,
      
    }
  });
    

    // Text Animations
    gsap.from(firstF.chars, {
      yPercent: 200,
      stagger: 0.02,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".terrain",
        start: "top 75%",
        scrub: true,
      }
    });

    gsap.from(thirdF.chars, {
      yPercent: 200,
      stagger: 0.02,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".terrain",
        start: "top 75%",
        scrub: true,
      }
    });

    /* ===== FIXED TACO VIDEO LOGIC ===== */
    const video = tacoVideoRef.current;
    
    // Video ko ensure karna ke metadata load ho jaye
    if (video) {
      video.pause(); 
      video.currentTime = 0;
    }

    gsap.from(".taco", {
      xPercent: -65, // Aapki original requirement ke mutabiq movement
      ease: "none",
      stagger:0.02,
      scrollTrigger: {
        trigger: ".terrain",
        start: "top 75%",
        
        scrub: 2, // Smoothness add karne ke liye (stuck nahi hogi)
        onUpdate: (self) => {
          if (video && video.readyState >= 2) { // Check if video is ready
            const scrollPos = self.progress;
            const videoDuration = video.duration;
            if (!isNaN(videoDuration)) {
              // Frame-by-frame calculation
              video.currentTime = videoDuration * scrollPos;
            }
          }
        }
      }
    });

   

    

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, { scope: sectionRef });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "200% top",
          scrub: 1.5,
          pin: true,
        }
      });

      pinTl.from(cardsRef.current, {
        yPercent: 150,
        stagger: 0.25,
        ease: "power1.out",
      });

      cardsRef.current.forEach((card, i) => {
        const videoEl = videosRef.current[i];
        ScrollTrigger.create({
          trigger: card,
          start: "top 25%",
          end: "bottom -80%",
          onEnter: () => videoEl?.play().catch(() => {}),
          onEnterBack: () => videoEl?.play().catch(() => {}),
          onLeave: () => {
            if (videoEl) {
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          },
          onLeaveBack: () => {
            if (videoEl) {
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="terrain bg-[radial-gradient(circle,_#800D16_0%,_#5E0910_40%,_#320409_100%)] py-12 px-12 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-no-repeat bg-center z-0 scale-100 rotate-180 scale-x-150 -translate-y-178"
        style={{ backgroundImage: "url('/images/black.jpg')" }}
      ></div>
 
      <div className="text-center mb-14 -mt-5 relative z-10">
        <h2 className="uppercase first-text text-5xl md:text-8xl font-bold max-w-lg text-white overflow-hidden translate-x-100 ">
          Master Every 
        </h2>
        <h2 className="third z-1000 uppercase text-8xl font-bold max-w-xl overflow-hidden text-toyota-red rotate-180 translate-y-4 translate-x-88 tracking-[2.15rem] ">Terrain</h2>
        
        <video 
          src="/videos/Tacoma-truck.webm"
          preload="auto"
          muted
          loop={false}
          playsInline
          ref={tacoVideoRef}
          className="taco absolute -ml-40 scale-50 -mt-49 rotate-x-180 overflow-hidden mix-blend-difference"
        />

       
<div className="top-[360%] left-[640px] absolute text-sm flex flex-col items-center -translate-y-1">
  
  {/* Main Heading - Bilkul wahi jo aapne rakhi thi */}
  
  <div 
  style={{
    clipPath:"polygon(50% 0, 50% 0, 50% 100%, 50% 100%)"
  }}
    className="designed-dominate  text-toyota-red tracking-[1rem] scale-130 bg-white pl-45 -translate-x-90 pr-45 z-20 border-toyota-red uppercase flex items-center justify-center font-bold"
  >
    Designedtodominate
  </div>

  {/* Modern Clean Sub-bar */}
  <div
  style={{
    clipPath:"polygon(50% 0, 50% 0, 50% 100%, 50% 100%)"
  }}
   className="terrain-tags bg-toyota-red -translate-x-94 -translate-y-1 flex items-center justify-center px-10 py-2 border-milk-yellow border-t-0 border-1 w-140">
    <div className="flex  items-center gap-4 text-milk-yellow uppercase tracking-[0.5rem] font-medium">
      <span>streets</span>
      <span className="opacity-40 scale-150 text-white font-light">|</span>
      <span>forests</span>
      <span className="opacity-40 scale-150 text-white font-light">|</span>
      <span>pinnacl</span>
    </div>
  </div>
</div>
      </div>

      <div className="relative h-[520px] max-w-6xl mx-auto -translate-y-10">
        {videoVariants.map((item, i) => (
          <div
            key={i}
            ref={el => (cardsRef.current[i] = el)}
            className="absolute left-25 z-100 w-250 h-[320px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
            style={{
              top: `${i * 40}px`,
              zIndex: i + 1
            }}
          >
            <video
              ref={el => (videosRef.current[i] = el)}
              src={item.video}
              muted
              playsInline
              preload="none"
              loading="lazy"
              className="absolute z-10 inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 bg-black/55 p-8 h-full flex flex-col justify-end">
              <h3 className="text-4xl font-bold text-white">{item.title}</h3>
              <p className="text-gray-300 mt-2">{item.subtitle}</p>
              <div className="flex gap-6 mt-6">
                {item.stats.map((s, idx) => (
                  <span key={idx} className="text-sm text-gray-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}