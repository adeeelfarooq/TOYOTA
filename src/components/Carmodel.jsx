
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "meshoptimizer";

export default function CarModel({ scrollProgress }) {
  const { scene } = useGLTF("/models/toyota_gr_supra-compressed.glb", true, undefined, loader => {
  loader.setMeshoptDecoder(MeshoptDecoder);
});
  const ref = useRef();
  

  // Optimize scene meshes once
  const model = useMemo(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return scene;
  }, [scene]);

  // Track current rotation
  const currentRotation = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    // Continuous automatic rotation
    currentRotation.current += 0.003; // adjust speed here

    // Scroll-based rotation added
    const scrollRotation = scrollProgress.current * Math.PI * 2;

    // Combine scroll + auto rotation
    ref.current.rotation.y = currentRotation.current + scrollRotation;

    // Keep rotation within 0-2π for smooth looping
    if (currentRotation.current > Math.PI * 2) currentRotation.current -= Math.PI * 2;
  });

  return (
    <primitive
      ref={ref}
      object={model}
      scale={0.9}               // car size
      position={[0, -0.6, 0]}   // move car down
    />
  );
}

// Preload model
useGLTF.preload("/models/toyota_gr_supra-compressed.glb");
