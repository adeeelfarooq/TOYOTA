import React, { useRef } from "react";
import { cards } from "../constants"; // Apni path check kr lena

const Videos = () => {
  const videoRefs = useRef([]); 

  const handlePlay = (index) => {
    const video = videoRefs.current[index];
    if (video) video.play();
  };

  const handlePause = (index) => {
    const video = videoRefs.current[index];
    if (video) video.pause();
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative z-20 pointer-events-none">
      <div className="relative w-full h-full mt-20 md:-mt-5">
        {cards.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => handlePlay(i)}
            onMouseLeave={() => handlePause(i)}
            // 'video-card' class add ki hai taake TestPage isko animate kr sake
            className={`video-card cursor-pointer pointer-events-auto absolute right-[10%] md:right-[15%] w-60 h-36 md:w-72 md:h-130 rounded-2xl overflow-hidden border-[3px] border-milk-yellow shadow-2xl bg-black ${card.rotation} ${card.translation}`}
            style={{
              top: `${15 + (i * 1)}%`,
              zIndex: i + 1,
              // Initial opacity 0 taake animation se pehle na dikhay
              opacity: 0 
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

export default Videos;