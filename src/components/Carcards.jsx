import { useRef, useEffect } from "react";

export default function CarCards({ title, type, image, video }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  // Desktop hover (unchanged)
  const enter = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  };

  const leave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  // Mobile viewport play - SIMPLE FIX
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    // Load video first
    video.load();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Try to play video
          const playPromise = video.play();
          
          // Handle autoplay restrictions
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // If autoplay fails, try with user gesture simulation
              console.log("Autoplay prevented:", error);
              
              // Add a click handler to allow play on first tap
              const handleFirstTap = () => {
                video.play().catch(() => {});
                card.removeEventListener('click', handleFirstTap);
                card.removeEventListener('touchstart', handleFirstTap);
              };
              
              card.addEventListener('click', handleFirstTap);
              card.addEventListener('touchstart', handleFirstTap);
            });
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []);

  // Add click handler for mobile
  const handleClick = () => {
    // On mobile, clicking the card should play/pause video
    if (window.innerWidth < 768 && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={handleClick}
      className="car-card relative w-[410px] h-[260px] group cursor-pointer shrink-0"
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="
          absolute inset-0 w-full h-full object-contain
          transition-opacity duration-500
          md:group-hover:opacity-0
        "
        loading="lazy"
      />

      {/* VIDEO */}
      <video
        ref={videoRef}
        src={video}
        muted
        playsInline
        preload="metadata"
        className="
          absolute inset-0 w-full h-full object-contain
          opacity-100 md:opacity-0
          md:group-hover:opacity-100
          transition-opacity duration-500
        "
      />

      {/* TEXT */}
      <div className="absolute -bottom-14 left-0">
        <p className="text-xs tracking-widest text-gray-400">{type}</p>
        <h3 className="text-xl font-light tracking-wide">{title}</h3>
      </div>

      <span
        className="
          absolute -bottom-8 left-0 h-[1px] w-0
          bg-white/50 transition-all duration-700
          group-hover:w-full
        "
      />
    </div>
  );
}