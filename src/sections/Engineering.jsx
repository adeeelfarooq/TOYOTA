import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Plugins register karein
gsap.registerPlugin(ScrollTrigger, SplitText);

const EngineeringSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); 
  const imageRef = useRef(null);
  const textTopRef = useRef(null);
  const textBottomRef = useRef(null);
  const paragraphRef = useRef(null);
  const splitTextRef = useRef(null);
  const partRefs = useRef([]);
  partRefs.current = [];

  const addToRefs = (el) => {
    if (el && !partRefs.current.includes(el)) {
      partRefs.current.push(el);
    }
  };

  const partsData = [
    { title: "POWERHOUSE ENGINE", desc: "Dual VVT-i technology for maximum torque and fuel efficiency.", top: "85%", left: "0%" },
    { title: "HIGH-GRIP TIRES", desc: "Enhanced tread pattern for superior road holding and wet-grip safety.", top: "95%", left: "28%" },
    { title: "ERGONOMIC SEATING", desc: "Whiplash injury lessening seats with premium lateral support.", top: "88%", left: "55%" },
    { title: "AERODYNAMIC BODY", desc: "High-tensile steel shell designed for 5-star safety and low drag.", top: "90%", left: "87%" }
  ];

  // CANVAS DRAWING LOGIC (Optimized for performance)
  useEffect(() => {
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl || !canvasEl) return;
    
    let animationFrameId;
    let isVisible = false;

    // Performance: Only draw when section is visible
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const renderFrame = () => {
      if (!isVisible || videoEl.paused || videoEl.ended) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      const ctx = canvasEl.getContext("2d", { alpha: false }); // alpha: false improves performance for opaque videos
      
      if (videoEl.videoWidth && canvasEl.width !== videoEl.videoWidth) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
      }

      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const handleLoadedData = () => {
      const ctx = canvasEl.getContext("2d", { alpha: false });
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
      observer.disconnect();
      videoEl.removeEventListener("play", renderFrame);
      videoEl.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  // GSAP ANIMATION LOGIC
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (splitTextRef.current) {
        splitTextRef.current.top?.revert();
        splitTextRef.current.bottom?.revert();
        splitTextRef.current = null;
      }
      
      const splitTextTop = new SplitText(textTopRef.current, {
        type: "words",
        wordsClass: "word-item-top transform-gpu will-change-transform", // Hardware acceleration
      });

      const splitTextBottom = new SplitText(textBottomRef.current, {
        type: "words",
        wordsClass: "word-item-bottom transform-gpu will-change-transform", // Hardware acceleration
      });

      splitTextRef.current = { 
        top: splitTextTop, 
        bottom: splitTextBottom 
      };

      const wordsTop = gsap.utils.toArray(".word-item-top");
      const wordsBottom = gsap.utils.toArray(".word-item-bottom");
      
      gsap.set(wordsTop, { color: "#666", opacity: 0.7 });
      gsap.set(partRefs.current, { opacity: 0, y: 20, willChange: "transform, opacity" });
      gsap.set(wordsBottom, { color: "#666", opacity: 0.7 });

      wordsTop.forEach((word, i) => {
        gsap.to(word, {
          color: "#fff",
          opacity: 1,
          ease: "power2.out",
          force3D: true, // Optimization
          scrollTrigger: {
            trigger: textTopRef.current,
            start: `top+=${i * 250} 65%`,
            end: `top+=${i * 50 + 50} 100%`,
            scrub: 1,
          },
        });
      });

      wordsBottom.forEach((word, i) => {
        gsap.to(word, {
          color: "#eb0a1e",
          opacity: 1,
          ease: "power2.out",
          force3D: true, // Optimization
          scrollTrigger: {
            trigger: textBottomRef.current,
            start: `top+=${i * 50} 75%`,
            end: `top+=${i * 50 + 50} 100%`,
            scrub: 1,
          },
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", 
          toggleActions: "play none none reverse",
          pin: true,     
          markers: false
        }
      });
      
      const tll = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", 
          toggleActions: "play none none reverse",
          scrub: 1,
        }
      });

      partRefs.current.forEach((label, i) => {
        tll.to(label, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          force3D: true // Optimization
        }, `label-${i}`);
      });

      // 1. Image ko fade out karna aur Canvas/Video ko animate karna
      tl.to(imageRef.current, { opacity: 0, scale: 0.8, duration: 1, force3D: true }, 0)
        .to(canvasRef.current, { 
          opacity: 1, 
          scale: 1, 
          duration: 1,
          force3D: true,
          onStart: () => videoRef.current.play().catch(()=>{}) // Added catch to prevent errors
        }, 0)

      // 2. Texts ko move karna aur "Gap" khatam karna
      tl.to(textTopRef.current, {
        y: -200,
        x: -230,
        opacity: 0,
        duration: 1.5,
        color: "#ffffff",
        force3D: true
      }, 0)

      tl.to(textBottomRef.current, {
        y: -475,
        x: 20, 
        scale: 0.6,
        duration: 1.5,
        color: "#eb0a1e",
        force3D: true
      }, 0)

      // 3. Paragraph ko show karna
      tl.fromTo(paragraphRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.5, force3D: true }, 
        1 
      );

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="engineering-container"
      style={{
        gap: 225,
        backgroundColor: 'black',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Top Text */}
      <h1 
        ref={textTopRef} 
        className="text-white text-[10rem] font-extrabold tracking-[1.1rem] first-message transform-gpu will-change-transform"
      >
        ENGINEERED FROM
      </h1>

      {/* Media Wrapper */}
      <div className="media-wrapper">
        <img 
          ref={imageRef}
          src="/images/Parts.png" 
          alt="Toyota Chassis" 
          className="main-png scale-110 z-100 transform-gpu will-change-[transform,opacity]"
        />

        <canvas 
          ref={canvasRef}
          className="main-video transform-gpu will-change-[transform,opacity]"
          style={{ opacity: 0, pointerEvents: "none" }}
        />

        <video 
          ref={videoRef}
          muted 
          playsInline
          preload="metadata" // Save bandwidth on initial load
          style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
        >
          <source src="/videos/Parts11.mp4" type="video/mp4" />
        </video>

        <div className="callouts-overlay">
          {partsData.map((part, index) => (
            <div 
              key={index}
              ref={addToRefs}
              className="part-label transform-gpu"
              style={{ top: part.top, left: part.left }}
            >
              <div className="label-line"></div>
              <h3 className="text-toyota-red font-bold text-xl uppercase">{part.title}</h3>
              <p className="text-milk-yellow text-sm font-paragraph max-w-[200px] opacity-80">{part.desc}</p>
            </div>
          ))}
        </div>
      
      </div>

      {/* Bottom Text */}
      <h1 
        ref={textBottomRef} 
        className="text-toyota-red top-[65%] text-[10rem] font-extrabold tracking-[0.7rem] first-message transform-gpu will-change-transform"
      >
        THE INSIDE
      </h1>

      {/* Paragraph Description */}
      <div ref={paragraphRef} className="desc-container font-paragraph transform-gpu will-change-[transform,opacity]">
        <p>
           A seamless integration of 
          power, stability, and futuristic design, crafted from the core to the surface.
        </p>
      </div>

      <style jsx>{`
        .engineering-container {
          perspective: 1000px;
        }
        
        .white-text { color: #ffffff; }
        .red-text { color: #eb0a1e; }

        .media-wrapper {
          position: absolute;
          width: 80%;
          height: 50vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }

        .main-png {
          width: 100%;
          max-width: 900px;
          object-fit: contain;
          position: absolute;
        }

        .main-video {
          z-index: -100;
          width: 100%;
          max-width: 1100px;
          object-fit: contain;
          position: absolute;
          transform: scale(1.2); 
        }

        .callouts-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 20;
          pointer-events: none;
        }

        .part-label {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .label-line {
          width: 50px;
          height: 2px;
          background-color: #eb0a1e;
          margin-bottom: 8px;
          position: relative;
        }

        .label-line::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: #eb0a1e;
          border-radius: 50%;
          right: -3px;
          top: -2px;
        }

        .desc-container {
          position: absolute;
          top: 20%;
          right: [-30%];
          max-width: 580px;
          text-align: center;
        }

        .desc-container p {
          color: #fff8e1; 
          font-size: 0.8rem;
          line-height: 1.6;
          opacity: 0.8;
        }

        .word-item-top, .word-item-bottom {
          display: inline-block;
          position: relative;
        }

        @media (max-width: 768px) {
          .headline { font-size: 3rem; }
          .part-label { display: none; }
        }
      `}</style>
    </section>
  );
};

export default EngineeringSection;