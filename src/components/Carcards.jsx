import { useRef, useEffect } from "react";

export default function CarCards({ title, type, image, video }) {
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  // Safe play/pause functions
  const safePlay = () => {
    const v = videoRef.current;
    if (!v || !v.paused) return;
    const promise = v.play();
    if (promise !== undefined) promise.catch(() => {});
  };

  const safeStop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  // Desktop hover
  const enter = () => safePlay();
  const leave = () => safeStop();

  // Mobile auto-play using IntersectionObserver
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) safePlay();
        else safeStop();
      },
      { threshold: 0.6 }
    );

    observerRef.current.observe(v);

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="car-card relative w-[410px] h-[260px] group cursor-pointer shrink-0"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
      />

      <video
        ref={videoRef}
        src={video}
        muted
        preload="none"
        playsInline
        loading="lazy"
        className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="absolute -bottom-14 left-0">
        <p className="text-xs tracking-widest text-gray-400">{type}</p>
        <h3 className="text-xl font-light tracking-wide">{title}</h3>
      </div>

      <span className="absolute -bottom-8 left-0 h-[1px] w-0 bg-white/50 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}
