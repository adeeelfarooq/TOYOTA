import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cards } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const TestimonialVideos = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]); 
  const videoRefs = useRef([]); 

  const handlePlay = (index) => {
    const video = videoRefs.current[index];
    if (video) video.play();
  };

  const handlePause = (index) => {
    const video = videoRefs.current[index];
    if (video) video.pause();
  };

  useGSAP(() => {
    // Animation Logic
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#testimonial-section", // ✅ Matches ID in parent
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true, // ✅ Will pin the parent section
      },
    });

    // Initial State: Screen ke neechay
    gsap.set(cardsRef.current, { 
      y: window.innerHeight * 1.5,
      opacity: 0 
    });

    // Animation Sequence: One by One entry from bottom to top
    tl.to(cardsRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.8, // ✅ One by one entry
      ease: "power3.out",
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      // Added pointer-events-none here to let clicks pass through to parent text/buttons if needed
      className="w-full h-full flex flex-col items-center relative z-20 pointer-events-none"
    >
      <div className="relative w-full h-full mt-20 md:-mt-5">
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            onMouseEnter={() => handlePlay(i)}
            onMouseLeave={() => handlePause(i)}
            // ✅ Added pointer-events-auto so cards are clickable/hoverable
            className={`cursor-pointer pointer-events-auto absolute right-[10%] md:right-[15%] w-60 h-36 md:w-72 md:h-130 rounded-2xl overflow-hidden border-[3px] border-milk-yellow shadow-2xl bg-black ${card.rotation} ${card.translation}`}
            style={{
              top: `${15 + (i * 1)}%`, // Stacking logic
              zIndex: i + 1,
            }}
          >
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={card.src}
              muted
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            
            <div className="absolute bottom-3 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 pointer-events-none">
              <p className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                {card.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialVideos;