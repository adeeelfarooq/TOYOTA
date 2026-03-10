// src/components/TechnologySection.jsx
import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarModel from "../components/Carmodel";

gsap.registerPlugin(ScrollTrigger);

export default function TechnologySection() {
  const sectionRef = useRef();
  const scrollProgress = useRef(0);
  const controlsRef = useRef();
  const ringAnimRef = useRef(); // NEW ref for ground ring

  const carAnimRef = useRef(); 

  const [viewMode, setViewMode] = useState("default");
  const [cameraDistance, setCameraDistance] = useState(6);

  const discoverRef = useRef();
  const innovationRef = useRef();
  const perfectedRef = useRef();
  const modelNameRef = useRef();
  const descriptionRef = useRef();
  const numberRef = useRef();
  const viewModeRef = useRef();

  /* ---------- FIX 1: Initialize Camera Controls ---------- */
  useEffect(() => {
    let animationFrameId;
    let initialized = false; 

    const monitorAndInitialize = () => {
      const controls = controlsRef.current;

      if (!controls) {
        animationFrameId = requestAnimationFrame(monitorAndInitialize);
        return;
      }

      if (!initialized) {
        const distance = controls.getDistance();
        setCameraDistance(distance);

        if (distance > 3.5) setViewMode("default");
        else if (distance <= 3.5 && distance > 1.4) setViewMode("exterior");
        else if (distance <= 1.4) setViewMode("interior");

        initialized = true;
      }

      const currentDistance = controls.getDistance();
      setCameraDistance(currentDistance);

      setViewMode(prevViewMode => {
        if (currentDistance > 3.5) return "default";
        if (currentDistance <= 3.5 && currentDistance > 1.4) return "exterior";
        if (currentDistance <= 1.4) return "interior";
        return prevViewMode; 
      });

      animationFrameId = requestAnimationFrame(monitorAndInitialize);
    };

    animationFrameId = requestAnimationFrame(monitorAndInitialize);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ---------- FIX 2: Robust Scroll-based rotation for Car ---------- */
  // Ye wala useEffect specifically fix kiya gya hai ta ke refresh par bhi animation chale
  useEffect(() => {
    let ctx;
    let rafId;

    const initCarAnimation = () => {
      // Check agar car ka ref ya section abhi tak load nahi hua
      if (!carAnimRef.current || !sectionRef.current) {
        rafId = requestAnimationFrame(initCarAnimation); // Wait for next frame
        return;
      }

      // Jab Ref mil jaye, tab animation register karein
      ctx = gsap.context(() => {
        
        // Position Animation
        gsap.fromTo(
          carAnimRef.current.position,
          { y: -4 , opacity: 0  }, // start below the ground
          {
            opacity: 1,
            y: 0,     // final car position
            duration: 2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
        ringAnimRef.current,
        { y:300,   }, // start below car
        { y: 0, opacity: 1, duration: 2, ease: "power3.out" , 
          scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 20%",
              toggleActions: "play none none reverse",
            },
         },
        
      );
        // Scale Animation
        // gsap.fromTo(
        //   carAnimRef.current.scale,
        //   { x: 0.8, y: 0.8, z: 0.8 , opacity:0 },
        //   {
        //     opacity:1,
        //     x: 1,
        //     y: 1,
        //     z: 1,
        //     duration: 2,
        //     ease: "power3.out",
        //     scrollTrigger: {
        //       trigger: sectionRef.current,
        //       start: "top 10%",
        //       toggleActions: "play none none reverse",
        //     },
        //   }
        // );

      }, sectionRef);
    };

    // Start checking for ref
    initCarAnimation();

    // Cleanup
    return () => {
      if (ctx) ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []); // Run once on mount

  /* ---------- UI Animations ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main scroll animation for car rotation logic (progress tracking)
      gsap.to(scrollProgress, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          }
        },
      });

      gsap.fromTo(".scroll" , 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          delay: 0.6,
          ease: "bounce.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 10%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Staggered text animations
      gsap.fromTo(discoverRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(innovationRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 2.2,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(perfectedRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(modelNameRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.45,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(descriptionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%",
            toggleActions: "play none none reverse"
          }
        } 
      );

      gsap.fromTo(numberRef.current,
        { opacity: 0, scale: 0.5, color:"red" },
        {
          color:"red",
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.75,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 13%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ---------- Animate UI based on zoom ---------- */
  useEffect(() => {
    if (!viewModeRef.current) return;

    const tl = gsap.timeline();

    if (viewMode === "default") {
      tl.to(".ui-element", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.03
      }, 0);

      tl.to(".view-mode-indicator", {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 0);

      gsap.to(".indicator-default", { backgroundColor: "red", duration: 0.3, ease: "power2.out" });
      gsap.to(".indicator-exterior", { backgroundColor: "#6b7280", duration: 0.3, ease: "power2.out" });
      gsap.to(".indicator-interior", { backgroundColor: "#6b7280", duration: 0.3, ease: "power2.out" });

    } else if (viewMode === "exterior") {
      tl.to(".ui-element", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.in",
        stagger: 0.02
      }, 0);

      tl.to(".view-mode-indicator", {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 0);

      gsap.to(".indicator-default", { backgroundColor: "#6b7280", duration: 0.3, ease: "power2.out" });
      gsap.to(".indicator-exterior", { backgroundColor: "red", duration: 0.3, ease: "power2.out" });
      gsap.to(".indicator-interior", { backgroundColor: "#6b7280", duration: 0.3, ease: "power2.out" });

    } else if (viewMode === "interior") {
      tl.to(".ui-element", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.in",
        stagger: 0.02
      }, 0);

      tl.to(".view-mode-indicator", {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 0);

      gsap.to(".indicator-default", { backgroundColor: "#6b7280", duration: 0.3, ease: "power2.out" });
      gsap.to(".indicator-exterior", { backgroundColor: "#6b7280", duration: 0.3, ease: "power2.out" });
      gsap.to(".indicator-interior", { backgroundColor: "red", duration: 0.3, ease: "power2.out" });
    }

    gsap.to(".view-mode-text", {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    });

  }, [viewMode]);

  useEffect(() => {
    console.log("Camera Distance:", cameraDistance, "View Mode:", viewMode);
  }, [cameraDistance, viewMode]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 rotate-180"
        style={{
          backgroundImage: "url('/images/bg-1.png')",
        }}
      ></div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Left Content - Top Left */}
      <div className="absolute top-12 left-16 z-20 max-w-md">
        <div className="mb-6">
          <div className="overflow-hidden mb-1">
            <h1
              ref={discoverRef}
              className="ui-element text-7xl font-bold uppercase text-white tracking-tight leading-none opacity-0"
            >
              Discover
            </h1>
          </div>

          <div className="overflow-hidden mb-1">
            <h2
              ref={innovationRef}
              className="ui-element uppercase text-5xl font-bold text-red-600 tracking-tight leading-none opacity-0"
            >
              Innovation
            </h2>
          </div>

          <div className="overflow-hidden">
            <h3
              ref={perfectedRef}
              className="ui-element text-4xl uppercase font-bold text-white tracking-tight leading-none opacity-0"
            >
              Perfected
            </h3>
          </div>
        </div>

        <div className="overflow-hidden mb-8">
          <h4
            ref={modelNameRef}
            className="ui-element text-xl font-medium text-gray-400 tracking-wide uppercase opacity-0"
          >
          </h4>
        </div>
      </div>

      {/* Left Bottom Corner - Small Description */}
      <div className="absolute bottom-32 left-16 z-20 max-w-xs">
        <div className="overflow-hidden">
          <p
            ref={descriptionRef}
            className="ui-element text-milk-yellow text-xs leading-relaxed opacity-0 font-paragraph"
          >
            Advanced automotive systems and precision engineering redefine driving excellence.
          </p>
        </div>
      </div>

      {/* Right Bottom Corner - Number 01 */}
      <div className="absolute right-20 bottom-20 z-20">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border border-red-600/30"></div>
          <div
            ref={numberRef}
            className="ui-element relative text-3xl font-black text-milk-yellow opacity-0 "
          >
            GR
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <span className="text-milk-yellow text-xl font-medium">TOYOTA</span>
          </div>
        </div>
      </div>

      {/* View Mode Indicator */}
      <div
        ref={viewModeRef}
        className="view-mode-indicator absolute top-10 right-10 z-30 pointer-events-none"
      >
        <div className="bg-black/60 backdrop-blur-lg rounded-xl p-5 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-3">
              <div className="indicator-default w-4 h-4 rounded-full bg-gray-600"></div>
              <div className="indicator-exterior w-4 h-4 rounded-full bg-gray-600"></div>
              <div className="indicator-interior w-4 h-4 rounded-full bg-gray-600"></div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="view-mode-text">
                <span className={`text-sm font-semibold ${viewMode === "default" ? 'text-white' : 'text-gray-500'}`}>
                  OVERVIEW
                </span>
              </div>
              <div className="view-mode-text">
                <span className={`text-sm font-semibold ${viewMode === "exterior" ? 'text-white' : 'text-gray-500'}`}>
                  EXTERIOR
                </span>
              </div>
              <div className="view-mode-text">
                <span className={`text-sm font-semibold ${viewMode === "interior" ? 'text-white' : 'text-gray-500'}`}>
                  INTERIOR
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-milk-yellow text-xs mb-1">ZOOM LEVEL</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, ((7 - cameraDistance) / (7 - 0.9)) * 100))}%`
                }}
              ></div>
            </div>
            <div className="text-milk-yellow text-xs mt-2">
              Distance: {cameraDistance.toFixed(1)} units
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0 z-1 translate-x-10"
        camera={{ position: [0, 1.2, 6], fov: 45 }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <directionalLight position={[0, 10, 0]} intensity={0.4} />

        {/* Car Model */}
        <CarModel scrollProgress={scrollProgress} animRef={carAnimRef} />

        {/* OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={0.2}
          maxDistance={7}
          zoomSpeed={0.8}
          rotateSpeed={0.6}
          enableDamping={true}
          dampingFactor={0.08}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
          makeDefault={true}
        />
      </Canvas>
      
      <div
      ref={ringAnimRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-0 ">
        {/* Rotating Ground Ring */}
        <img
          src="/images/ring.png"
          alt="ground ring"
          className="
            w-[440px]
            opacity-60
            translate-x-10
            scale-x-[1.8]
            scale-y-[0.8]
            blur-[0.6px]
            animate-[spin_40s_linear_infinite_reverse]
            origin-center
          "
        />
      </div>

      {/* Shadow under car */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-96 h-14 rounded-full bg-black/50 blur-2xl"></div>

      {/* Scroll indicator */}
      <div className="scroll absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-milk-yellow text-xs">SCROLL TO ROTATE</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Debug info */}
      <div className="absolute bottom-4 left-4 text-xs text-milk-yellow z-30">
        Camera Distance: {cameraDistance.toFixed(2)} | View Mode: {viewMode}
      </div>
    </section>
  );
}