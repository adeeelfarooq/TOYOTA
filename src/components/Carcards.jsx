import { useRef, useEffect } from "react";

export default function CarCards({ title, type, image, video , Scale }) {
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

  // Mobile viewport play
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="car-card relative w-[410px] h-[260px] group cursor-pointer shrink-0"
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className={`${Scale}
          absolute inset-0 w-full h-full object-contain
          transition-opacity duration-500
          md:group-hover:opacity-0
        `}
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
