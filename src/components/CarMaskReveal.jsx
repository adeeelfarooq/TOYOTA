import React, { useRef } from "react";
import gsap from "gsap";

// 🎯 Custom Hook for Car Mask & Hover Logic
export function useCarMaskReveal(sectionRef, bgWrapperRef, autoInkGroupMaskRef, autoInkGroupVisRef) {
  const circlesRef = useRef([]);
  const circleIndex = useRef(0);
  const NUM_CIRCLES = 30;

  const isHoveringCar = useRef(false);
  const inkTimerRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (!sectionRef.current || !bgWrapperRef.current) return;

    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    gsap.to(".parallax-target", { x: x * 30, y: y * 20, duration: 1, ease: "power2.out", overwrite: "auto" });

    if (isHoveringCar.current) {
      const rect = bgWrapperRef.current.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      const circle = circlesRef.current[circleIndex.current];
      if (circle) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        gsap.killTweensOf(circle);
        gsap.set(circle, { attr: { cx: localX + offsetX, cy: localY + offsetY } });
        gsap.fromTo(circle, { opacity: 1, attr: { r: 0 } }, { attr: { r: Math.random() * 30 + 80 }, duration: 0.2, ease: "power2.out" });
        gsap.to(circle, { attr: { r: 0 }, opacity: 0, duration: 0.6, delay: 0.5 + Math.random() * 0.3, ease: "power3.inOut" });
      }
      circleIndex.current = (circleIndex.current + 1) % NUM_CIRCLES;

      gsap.to([autoInkGroupMaskRef.current, autoInkGroupVisRef.current], { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });

      if (inkTimerRef.current) inkTimerRef.current.kill();
      inkTimerRef.current = gsap.delayedCall(1.4, () => {
        gsap.to([autoInkGroupMaskRef.current, autoInkGroupVisRef.current], { opacity: 1, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
      });
    }
  };

  const handleImageEnter = () => { isHoveringCar.current = true; };
  const handleImageLeave = () => {
    isHoveringCar.current = false;
    if (inkTimerRef.current) inkTimerRef.current.kill();
    inkTimerRef.current = gsap.delayedCall(1.4, () => {
      gsap.to([autoInkGroupMaskRef.current, autoInkGroupVisRef.current], { opacity: 1, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
    });
  };

  return { circlesRef, NUM_CIRCLES, handleMouseMove, handleImageEnter, handleImageLeave };
}

// 🟢 Mouse Trail Masks
export const MouseTrailMaskElements = ({ circlesRef, NUM_CIRCLES }) => (
  <>
    {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
      <circle key={i} ref={(el) => (circlesRef.current[i] = el)} cx="0" cy="0" r="1" fill="url(#soft-brush)" className="will-change-transform" />
    ))}
  </>
);

// 🟢 Car Images Layer
export const CarImagesLayer = ({ handleImageEnter, handleImageLeave }) => (
  <div className="absolute inset-0 w-full h-full parallax-target pointer-events-auto transform-gpu">
    <div className="absolute inset-0 w-full h-full opacity-40 pointer-events-none -scale-y-100 translate-y-[42%]" style={{ WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)", maskImage: "linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)" }}>
      <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover scale-70 " alt="Base Reflection" />
      <img src="/images/spn2.png" className="absolute inset-0 w-full h-full object-cover scale-68 pointer-events-none mt-2 -ml-2" style={{ WebkitMaskImage: "url(#liquid-trail-mask)", maskImage: "url(#liquid-trail-mask)" }} alt="Hover Reflection" />
    </div>
    <img src="/images/hero1.png" className="absolute inset-0 w-full h-full object-cover scale-70 " alt="Base" />
    <img src="/images/spn2.png" className="absolute inset-0 w-full h-full object-cover scale-68 pointer-events-auto mt-2 -ml-2" style={{ WebkitMaskImage: "url(#liquid-trail-mask)", maskImage: "url(#liquid-trail-mask)" }} alt="Hover" onMouseEnter={handleImageEnter} onMouseLeave={handleImageLeave} />
  </div>
);