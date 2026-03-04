import { useRef, useEffect } from "react";

export default function CarCards({ title, type, image, video, Scale, Videoscale }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Canvas Add kiya hai IDM ko bypass karne k liye
  const cardRef = useRef(null);

  // Desktop hover
  const enter = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  };

  const leave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  // Mobile viewport play
  useEffect(() => {
    const videoEl = videoRef.current;
    const card = cardRef.current;
    if (!videoEl || !card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Canvas Drawing Logic (IDM ko dhoka deny k liye)
  useEffect(() => {
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    let animationFrameId;

    const renderFrame = () => {
      // Jab video play ho rahi ho tabhi canvas par draw karega (Highly Optimized)
      if (videoEl.paused || videoEl.ended) return;

      const ctx = canvasEl.getContext("2d");
      
      // Video ki original quality maintain rakhne k liye
      if (videoEl.videoWidth && canvasEl.width !== videoEl.videoWidth) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
      }

      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    // First frame draw karne k liye jab video load ho jaye
    const handleLoadedData = () => {
      const ctx = canvasEl.getContext("2d");
      if (videoEl.videoWidth) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
      }
    };

    videoEl.addEventListener("play", renderFrame);
    videoEl.addEventListener("loadeddata", handleLoadedData);

    return () => {
      cancelAnimationFrame(animationFrameId);
      videoEl.removeEventListener("play", renderFrame);
      videoEl.removeEventListener("loadeddata", handleLoadedData);
    };
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
        className={`${Scale} absolute inset-0 w-full h-full object-contain transition-opacity duration-500 md:group-hover:opacity-0`}
      />

      {/* VISIBLE CANVAS (Yeh Video ki tarah dikhega lekin IDM isay pakar nahi saky ga) */}
      <canvas
        ref={canvasRef}
        className={` ${Videoscale}
          absolute inset-0 w-full h-full object-contain
          opacity-100 md:opacity-0
          md:group-hover:opacity-100
          transition-opacity duration-500
          pointer-events-none
        `}
      />

      {/* HIDDEN ACTUAL VIDEO (Sirf logic run karne k liye, UI mein bilkul hidden hai) */}
      <video
        ref={videoRef}
        src={video}
        muted
        playsInline
        preload="metadata"
        // 1px ka size takay IDM isay tracking pixel samajh k ignore kar de
        style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
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