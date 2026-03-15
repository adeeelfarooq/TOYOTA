import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// 🎯 Custom Hook for Auto Ink Logic
export function useAutoInk(sectionRef) {
  const autoInkGroupMaskRef = useRef(null);
  const autoInkGroupVisRef = useRef(null);
  const autoInkMaskRef = useRef(null);
  const autoInkVisualRef = useRef(null);

  const autoPartsMaskRef = useRef([]);
  const autoPartsVisRef = useRef([]);
  const autoPartIndex = useRef(0);
  const NUM_AUTO_PARTS = 20;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (autoInkMaskRef.current && autoInkVisualRef.current && window.innerWidth > 0) {
        let isCenterDash = false;

        function dropParticle() {
          if (Math.random() > 0.4) return;
          const target = this.targets()[0];
          const currX = gsap.getProperty(target, "x");
          const currY = gsap.getProperty(target, "y");
          
          const idx = autoPartIndex.current;
          const maskPart = autoPartsMaskRef.current[idx];
          const visPart = autoPartsVisRef.current[idx];
          
          if (maskPart && visPart) {
            const offsetX = gsap.utils.random(-80, 80);
            const offsetY = gsap.utils.random(-50, 50);
            const size = gsap.utils.random(20, 60);

            gsap.killTweensOf([maskPart, visPart]);
            gsap.set([maskPart, visPart], { 
              x: currX + offsetX, y: currY + offsetY, scale: size, opacity: gsap.utils.random(0.6, 1) 
            });
            gsap.to([maskPart, visPart], { 
              scale: 0, opacity: 0, duration: gsap.utils.random(0.8, 1.5), ease: "power2.out" 
            });
          }
          autoPartIndex.current = (idx + 1) % NUM_AUTO_PARTS;
        }

        const animateBlob = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          
          if (!isCenterDash) {
            const newX = gsap.utils.random(-200, w + 200);
            const newY = gsap.utils.random(-200, h + 200);
            const speed = gsap.utils.random(2, 3);
            
            gsap.to([autoInkMaskRef.current, autoInkVisualRef.current], {
              x: newX, y: newY, duration: speed, ease: "power1.inOut",
              onUpdate: dropParticle, onComplete: () => { isCenterDash = true; animateBlob(); }
            });
          } else {
            const dashes = Math.floor(gsap.utils.random(2, 4));
            const dashDuration = 1.0 / dashes;
            const dashTl = gsap.timeline({ onComplete: () => { isCenterDash = false; animateBlob(); }});
            let currentSide = Math.random() > 0.5 ? 1 : -1;

            for (let i = 0; i < dashes; i++) {
              const targetX = currentSide === 1 ? w + 300 : -300;
              const targetY = gsap.utils.random(h * 0.4, h * 0.6);
              dashTl.to([autoInkMaskRef.current, autoInkVisualRef.current], {
                x: targetX, y: targetY, duration: dashDuration, ease: "power1.inOut", onUpdate: dropParticle
              });
              currentSide *= -1;
            }
          }
        };

        const breatheBlob = () => {
          const newRx = gsap.utils.random(250, 400);
          const newRy = gsap.utils.random(50, 100); 
          gsap.to([autoInkMaskRef.current, autoInkVisualRef.current], {
            attr: { rx: newRx, ry: newRy }, duration: gsap.utils.random(0.5, 1.2), ease: "sine.inOut",
            onComplete: breatheBlob 
          });
        };

        animateBlob();
        breatheBlob();
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [sectionRef]);

  return { autoInkGroupMaskRef, autoInkGroupVisRef, autoInkMaskRef, autoInkVisualRef, autoPartsMaskRef, autoPartsVisRef, NUM_AUTO_PARTS };
}

// 🟢 Auto Ink Mask Components
export const AutoInkMaskElements = ({ autoInkGroupMaskRef, autoInkMaskRef, autoPartsMaskRef, NUM_AUTO_PARTS }) => (
  <g ref={autoInkGroupMaskRef}>
    <ellipse ref={autoInkMaskRef} cx="0" cy="0" rx="300" ry="80" fill="url(#soft-brush)" className="will-change-transform" />
    {Array.from({ length: NUM_AUTO_PARTS }).map((_, i) => (
      <circle key={`auto-m-${i}`} ref={(el) => (autoPartsMaskRef.current[i] = el)} cx="0" cy="0" r="1" fill="url(#soft-brush)" className="will-change-transform" />
    ))}
  </g>
);

// 🟢 Auto Ink Visible Components
export const AutoInkVisualElements = ({ autoInkGroupVisRef, autoInkVisualRef, autoPartsVisRef, NUM_AUTO_PARTS }) => (
  <g ref={autoInkGroupVisRef}>
    <ellipse ref={autoInkVisualRef} cx="0" cy="0" rx="300" ry="80" fill="url(#lando-ink)" className="will-change-transform" />
    {Array.from({ length: NUM_AUTO_PARTS }).map((_, i) => (
      <circle key={`auto-v-${i}`} ref={(el) => (autoPartsVisRef.current[i] = el)} cx="0" cy="0" r="1" fill="url(#lando-ink)" className="will-change-transform" />
    ))}
  </g>
);