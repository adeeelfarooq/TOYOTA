import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import TestimonialVideos from "../components/Reviewcards"; // Ensure path is correct

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ModernTestimonialsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bgRef = useRef(null);
  const statsRef = useRef([]);
  const imgRef = useRef(null);

  // Stats data
  const stats = [
    { value: "98%", label: "Customer Satisfaction" },
    { value: "25+", label: "Years Average Lifespan" },
    { value: "10M+", label: "Toyotas on Road" },
    { value: "99%", label: "Reliability Score" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SplitText setup
      const splitTitle = new SplitText(titleRef.current, {
        type: "chars,words",
        wordsClass: "word",
        charsClass: "char"
      });
      
      const splitSubtitle = new SplitText(subtitleRef.current, {
        type: "chars",
        charsClass: "char"
      });

      // Create a timeline for sequence WITH SCROLLTRIGGER
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        }
      });

      // 1. Background animation
      tl.fromTo(bgRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power3.out" }
      );

      // 2. Title animation
      tl.from(splitTitle.chars, {
        x: -100, opacity: 0, stagger: 0.03, duration: 1.2, ease: "back.out(1.7)"
      }, "-=1.5");

      // 3. Subtitle animation
      tl.from(splitSubtitle.chars, {
        y: -30, rotateY: 160, opacity: 0, stagger: 0.008, duration: 1, ease: "power3.out"
      }, "-=0.8");

      // 4. Stats animation
      tl.from(statsRef.current, {
        x: -50, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out"
      }, "-=1.5");

      // Image Logic
      gsap.set(imgRef.current, {
        x: -300, opacity: 0, rotationY: -190, rotationX: 10, transformPerspective: 1200,
      });

      // 🔹 Scroll-triggered entry animation
      gsap.to(imgRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          toggleActions: "play none none reverse",
        },
        x: 0, opacity: 1, rotationY: 0, rotateX: 0, duration: 1.8, ease: "power3.out",
        onComplete: () => {
          // 🔹 Floating animation AFTER entry
          gsap.to(imgRef.current, {
            y: "+=25", duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true,
          });
        },
      });

      // Cleanup
      return () => { splitTitle.revert(); splitSubtitle.revert(); };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonial-section" // ✅ ADDED THIS: Must match child trigger
      ref={sectionRef}
      className="relative bg-gradient-to-b from-black  to-black text-white h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4"
    >
      {/* Animated background elements */}
      <div 
        ref={bgRef}
        className="absolute inset-0 opacity-20 pointer-events-none"
        // style={{
        //   backgroundImage: `
        //     radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.15) 0%, transparent 50%),
        //     radial-gradient(circle at 80% 20%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
        //     radial-gradient(circle at 40% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%)
        //   `
        // }}
      />
      
      {/* Floating particles */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          />
        ))}
      </div> */}

      <div className="relative z-10 max-w-7xl mt-15 h-full w-full">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 
            ref={titleRef}
            className="text-5xl md:text-7xl -translate-x-100  lg:text-8xl font-bold uppercase tracking-tight mb-6"
          >
            Voices of <span className=" text-toyota-red  ">Trust</span>
          </h2>
          
          <p 
            ref={subtitleRef}
            className="mt-6 -translate-x-98  text-milk-yellow text-xs max-w-sm mx-auto font-light font-paragraph"
          >
            Real experiences from Toyota owners worldwide. Discover why millions choose reliability.
          </p>
          <img
            src="/images/tyt.png"
            ref={imgRef}
            className="absolute h-120 w-90 ml-20 -mt-5"
          />
        </div>

        {/* Stats */}
        <div className="stats-container absolute scale-75 flex flex-col translate-x-135 -translate-y-80 gap-8 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={el => (statsRef.current[index] = el)}
              className="text-center bg-gray-900/50 backdrop-blur-sm p-8  rounded-2xl border border-gray-800 min-w-[200px] hover:border-red-900/50 transition-colors duration-300"
            >
              <div className="text-5xl font-bold animate-pulse text-toyota-red mb-3">{stat.value}</div>
              <div className="text-milk-yellow text-sm font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ ADDED THIS: Testimonial Videos Integration */}
      {/* Positioned absolute top-0 right-0 to overlay correctly without breaking layout */}
      <div className="absolute top-0 right-0 w-full h-full z-20 pointer-events-none">
        <TestimonialVideos />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .char { display: inline-block; }
        .word { display: inline-block; overflow: hidden; }
      `}</style>
      
    </section>
  );
}