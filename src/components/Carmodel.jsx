import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "meshoptimizer";

export default function CarModel({ scrollProgress, animRef }) {
  const { scene } = useGLTF(
    "/models/toyota_gr_supra-compressed.glb",
    true,
    undefined,
    (loader) => {
      loader.setMeshoptDecoder(MeshoptDecoder);
    }
  );

  const ref = useRef(); // rotation
  // Wrap everything in group for animation
  const groupRef = animRef || useRef();

  const model = useMemo(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return scene;
  }, [scene]);

  // Track rotation
  const currentRotation = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    const scrollRotation = scrollProgress.current * Math.PI * 2;
    currentRotation.current += 0.003;
    ref.current.rotation.y = currentRotation.current + scrollRotation;

    if (currentRotation.current > Math.PI * 2) currentRotation.current -= Math.PI * 2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <primitive
        ref={ref}
        object={model}
        scale={0.9}              
        position={[0, -0.6, 0]}  // relative to group
      />
    </group>
  );
}

useGLTF.preload("/models/toyota_gr_supra-compressed.glb");
