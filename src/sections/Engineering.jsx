import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Plugins register karein
gsap.registerPlugin(ScrollTrigger, SplitText);

const EngineeringSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
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

  useEffect(() => {
    let ctx = gsap.context(() => {
      // SplitText cleanup and initialization
      if (splitTextRef.current) {
        splitTextRef.current.revert();
        splitTextRef.current = null;
      }
      
      // SplitText for "ENGINEERED FROM"
      const splitTextTop = new SplitText(textTopRef.current, {
        type: "words",
        wordsClass: "word-item-top",
      });

      // SplitText for "THE INSIDE"
      const splitTextBottom = new SplitText(textBottomRef.current, {
        type: "words",
        wordsClass: "word-item-bottom",
      });

      // Store for cleanup
      splitTextRef.current = { 
        top: splitTextTop, 
        bottom: splitTextBottom 
      };

      // Get all word elements
      const wordsTop = gsap.utils.toArray(".word-item-top");
      const wordsBottom = gsap.utils.toArray(".word-item-bottom");
      
      // Set initial state for top text
      gsap.set(wordsTop, { color: "#666", opacity: 0.7 });
      gsap.set(partRefs.current, { opacity: 0, y: 20 });
      
      // Set initial state for bottom text
      gsap.set(wordsBottom, { color: "#666", opacity: 0.7 });

      

      // Animate "ENGINEERED FROM" words
      wordsTop.forEach((word, i) => {
        gsap.to(word, {
          color: "#fff",
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textTopRef.current,
            start: `top+=${i * 250} 65%`,
            end: `top+=${i * 50 + 50} 100%`,
            scrub: 1,
          },
        });
      });

      // Animate "THE INSIDE" words
      wordsBottom.forEach((word, i) => {
        gsap.to(word, {
          color: "#eb0a1e",
          opacity: 1,
          ease: "power2.out",
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
          end: "+=400%", // Scroll length kitni lambi ho
              // Smooth scroll animation
          toggleActions: "play none none reverse",
          pin: true,     // Screen ko rok ke rakhay ga jab tak animation poori na ho
          markers: false
        }
      });
      const tll = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // Scroll length kitni lambi ho
              // Smooth scroll animation
          toggleActions: "play none none reverse",
               // Screen ko rok ke rakhay ga jab tak animation poori na ho
          
          scrub: 1,
        }
      });
      partRefs.current.forEach((label, i) => {
        tll.to(label, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }, `label-${i}`);
      });

      

      // 1. Image ko fade out karna aur Video ko play karna
      tl.to(imageRef.current, { opacity: 0, scale: 0.8, duration: 1 }, 0)
        .to(videoRef.current, { 
          opacity: 1, 
          scale: 1, 
          duration: 1,
          onStart: () => videoRef.current.play() 
        }, 0)

      // 2. Texts ko move karna aur "Gap" khatam karna
      // Top text uper aur left corner ki taraf
      tl.to(textTopRef.current, {
        y: -200,
        x: -230,
        opacity: 0,
        duration: 1.5,
        color: "#ffffff"
      }, 0)

      // Bottom text (Inside) uper ja kar "Engineered From" ke sath jud jaye ga
      tl.to(textBottomRef.current, {
        y: -475, // Adjust this value based on your exact layout to remove gap
        x: 20,  // Move it slightly right to align after the first text
        scale: 0.6,
        duration: 1.5,
        color: "#eb0a1e"
      }, 0)

      // 3. Paragraph (Milk-yellow) ko show karna
      tl.fromTo(paragraphRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.5 }, 
        1 // Ye thora der baad start hoga
      );
      

      

    }, containerRef);

    return () => {
      // Cleanup SplitText
      if (splitTextRef.current) {
        if (splitTextRef.current.top) splitTextRef.current.top.revert();
        if (splitTextRef.current.bottom) splitTextRef.current.bottom.revert();
      }
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
        className="text-white text-[10rem] font-extrabold tracking-[1.1rem] first-message"
      >
        ENGINEERED FROM
      </h1>

      {/* Media Wrapper */}
      <div className="media-wrapper">
        {/* Your PNG Image */}
        <img 
          ref={imageRef}
          src="/images//Parts.png" 
          alt="Toyota Chassis" 
          className="main-png scale-110 z-100 "
        />

        {/* 3D Generated Video */}
        <video 
          ref={videoRef}
          className="main-video"
          muted 
          playsInline
          style={{ opacity: 0 }}
        >
          <source src="/videos/Parts11.mp4" type="video/mp4" />
        </video>

        <div className="callouts-overlay">
          {partsData.map((part, index) => (
            <div 
              key={index}
              ref={addToRefs}
              className="part-label"
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
        className="text-toyota-red top-[65%] text-[10rem] font-extrabold tracking-[0.7rem] first-message"
      >
        THE INSIDE
      </h1>

      {/* Paragraph Description */}
      <div ref={paragraphRef} className="desc-container font-paragraph">
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
          transform: scale(1.2); /* Video scale effect */
        }
           /* Callouts Styling */
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
          color: #fff8e1; /* Milk Yellow */
          font-size: 0.8rem;
          line-height: 1.6;
          opacity: 0.8;
        }

        /* Word animation classes */
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