import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Sphere, useScroll } from "@react-three/drei";
import { gsap } from "gsap";

export const Background = () => {
  const material = useRef();
  const color = useRef({
    color: "#b9bcff",
  });
  const data = useScroll();

  const timeline = useRef();

  useFrame(() => {
    timeline.current.progress(data.scroll.current);
    material.current.color = new THREE.Color(color.current.color);
  });

  useEffect(() => {
    timeline.current = gsap.timeline();
    timeline.current.to(color.current, {
      color: "#212121",
    });
    timeline.current.to(color.current, {
      color: "#7a7ca5",
    });
    timeline.current.to(color.current, {
      color: "#9b96dd",
    });
  }, []);

  return (
    <group>
      <Sphere scale={[30, 30, 30]}>
        <meshBasicMaterial
          ref={material}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </Sphere>
    </group>
  );
};
