import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const videoVariants = [
  {
    video: "/videos/Car-on-road.mp4",
    title: "URBAN",
    subtitle: "City Performance",
    stats: ["8.5″ Clearance", "4×4 System", "38° Angle"]
  },
  {
    video: "/videos/Suv-forest.mp4",
    title: "ADVENTURE",
    subtitle: "Off-Road Capability",
    stats: ["9.2″ Clearance", "AWD System", "42° Angle"]
  },
  {
    video: "/videos/Tacoma-mountain.mp4",
    title: "EXTREME",
    subtitle: "Mountain Terrain",
    stats: ["10.6″ Clearance", "4×4 Lock", "45° Angle"]
  }
];

export default function TerrainSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const videosRef = useRef([]);

  // GSAP high-level optimization for SplitText animations
  useGSAP(() => {
    const firstF = SplitText.create(".first-text", { type: "chars" });
    const paraSplit = SplitText.create(".terrain p", {
      type: "words, lines",
      linesClass: "paragraph-line"
    });

    gsap.from(firstF.chars, {
      yPercent: 200,
      stagger: 0.02,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".terrain",
        start: "top 75%",
        scrub: true,
      }
    });

    const revealPara = gsap.timeline({
      scrollTrigger: {
        trigger: ".terrain p",
        start: "top 10%",
        scrub: 1,
      }
    });

    revealPara.from(paraSplit.words, {
      yPercent: 300,
      rotate: 50,
      ease: "power1.inOut",
      duration: 1,
      stagger: 0.01,
    });

    // Refresh triggers after setup
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ===== PIN + STACK ANIMATION ===== */
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "200% top",
          scrub: 1.5,
          pin: true,
        }
      });

      pinTl.from(cardsRef.current, {
        yPercent: 150,
        stagger: 0.25,
        ease: "power1.out",
      });

      /* ===== VIDEO PLAY / PAUSE (Safe + Lazy Load) ===== */
      cardsRef.current.forEach((card, i) => {
        const videoEl = videosRef.current[i];
        ScrollTrigger.create({
          trigger: card,
          start: "top 25%",
          end: "bottom -80%",
          onEnter: () => videoEl?.play().catch(() => {}),
          onEnterBack: () => videoEl?.play().catch(() => {}),
          onLeave: () => {
            if (videoEl) {
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          },
          onLeaveBack: () => {
            if (videoEl) {
              videoEl.pause();
              videoEl.currentTime = 0;
            }
          },
        });
      });

      // Force ScrollTrigger refresh for smooth scroll
      requestAnimationFrame(() => ScrollTrigger.refresh());

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b terrain from-[#141414] via-[#0d0d0d] to-black py-12 px-12 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-14 -mt-5 relative z-10">
        <h2 className="uppercase first-text text-5xl md:text-8xl font-bold text-white overflow-hidden">
          Master Every <span className="text-toyota-red">Terrain</span>
        </h2>
        <p className="mt-6 text-gray-400 text-xl max-w-3xl mx-auto overflow-hidden">
          Designed to dominate streets, forests, and mountains.
        </p>
      </div>

      {/* STACK WRAPPER */}
      <div className="relative h-[520px] max-w-6xl mx-auto">
        {videoVariants.map((item, i) => (
          <div
            key={i}
            ref={el => (cardsRef.current[i] = el)}
            className="absolute left-25 z-100 w-250 h-[320px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
            style={{
              top: `${i * 40}px`,
              zIndex: i + 1
            }}
          >
            <video
              ref={el => (videosRef.current[i] = el)}
              src={item.video}
              muted
              playsInline
              preload="none"
              loading="lazy"
              className="absolute z-10 inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 bg-black/55 p-8 h-full flex flex-col justify-end">
              <h3 className="text-4xl font-bold text-white">{item.title}</h3>
              <p className="text-gray-300 mt-2">{item.subtitle}</p>
              <div className="flex gap-6 mt-6">
                {item.stats.map((s, idx) => (
                  <span key={idx} className="text-sm text-gray-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
