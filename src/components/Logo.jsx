import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Logo = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    // Delay 4.5 seconds rakha hai taake red screen hatne k baad logo show ho (Hero sync)
    gsap.to(logoRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 1.2,
      ease: "power2.inOut",
      delay: 4.5, 
    });
  }, []);

  return (
    <img
      ref={logoRef}
      src="/images/Toyota-logo.svg"
      alt="Toyota"
      // fixed aur z-[999] isko hamesha screen par start se end tak aik jagah rakhe ga
      className="fixed top-6 opacity-60 left-8 z-[999] w-32 pointer-events-none transform-gpu"
      style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" , filter: "brightness(0) invert(16%) sepia(93%) saturate(5831%) hue-rotate(349deg) brightness(97%) contrast(110%)" }}
    />
  );
};

export default Logo;