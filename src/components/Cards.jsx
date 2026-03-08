import React, { useRef, memo } from "react";
import { cards } from "../constants"; // Apni path check kr lena

// Wrapped in React.memo to prevent unnecessary re-renders during scrolling
const Videos = memo(() => {
  const videoRefs = useRef([]); 

  const handlePlay = (index) => {
    const video = videoRefs.current[index];
    // Added catch to prevent DOM Exception if user hovers too fast
    if (video) video.play().catch(() => {});
  };

  const handlePause = (index) => {
    const video = videoRefs.current[index];
    if (video) video.pause();
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative z-20 pointer-events-none transform-gpu">
      <div className="relative w-full h-full mt-20 md:-mt-5 transform-gpu">
        {cards.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => handlePlay(i)}
            onMouseLeave={() => handlePause(i)}
            className={`video-card cursor-pointer pointer-events-auto absolute right-[10%] md:right-[15%] w-60 h-36 md:w-72 md:h-130 rounded-2xl overflow-hidden border-[3px] border-milk-yellow shadow-2xl bg-black transform-gpu will-change-transform ${card.translation}`}
            style={{
              zIndex: i + 1,
              opacity: 0 
            }}
          >
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={card.src}
              muted
              playsInline
              loop
              preload="none" // Optimization: Only loads when visible/hovered, saves huge bandwidth
              className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300 transform-gpu backface-hidden"
            />
            
            <div className="absolute bottom-3 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 pointer-events-none transform-gpu">
              <p className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                {card.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Videos;