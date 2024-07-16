import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  useScroll,
} from "@react-three/drei";
import { animate, useMotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";

import { Avatar } from "./Avatar";
import { Office } from "./Office";
import { framerMotionConfig } from "../config";
import { Background } from "./Background";

export const Experience = (props) => {
  const { menuOpened } = props;

  const data = useScroll();

  const [section, setSection] = useState(0);
  const [characterAnimation, setCharacterAnimation] = useState("Typing");

  const { viewport } = useThree();

  const cameraPositionX = useMotionValue();
  const cameraLookAtX = useMotionValue();

  const characterContainerAboutRef = useRef();
  const characterGroup = useRef();

  const isMobile = window.innerWidth < 768;
  const responsiveRatio = viewport.width / 12;
  const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -5 : 0, { ...framerMotionConfig });
    animate(cameraLookAtX, menuOpened ? 5 : 0);
  }, [menuOpened]);

  useEffect(() => {
    setCharacterAnimation("Falling");

    setTimeout(() => {
      setCharacterAnimation(section === 0 ? "Typing" : "Standing");
    }, 600);
  }, [section]);

  useFrame((state, delta) => {
    let curSection = Math.floor(data.scroll.current * data.pages);

    if (curSection > 3) {
      curSection = 3;
    }

    if (curSection !== section) {
      setSection(curSection);
    }

    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);

    if (section === 0) {
      characterContainerAboutRef.current.getWorldPosition(
        characterGroup.current.position
      );
    }
  });

  return (
    <>
      <Background />

      <motion.group
        rotation={[
          -1.5207383520531768, 0.020656291046491207, 1.9977900466135774,
        ]}
        ref={characterGroup}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        animate={"" + section}
        transition={{ duration: 0.6 }}
        variants={{
          0: {
            scaleX: officeScaleRatio,
            scaleY: officeScaleRatio,
            scaleZ: officeScaleRatio,
            rotateX: 10.75,
          },
          1: {
            x: isMobile ? 0.3 : 0,
            y: isMobile ? -viewport.height + 0.5 : -viewport.height + 1.2,
            z: 7.9,
            rotateX: 10.75,
            rotateY: 0,
            rotateZ: isMobile ? -Math.PI * 0.4 : 0,
            scaleX: isMobile ? 1.5 : 1,
            scaleY: isMobile ? 1.5 : 1,
            scaleZ: isMobile ? 1.5 : 1,
          },
          2: {
            x: isMobile ? -1.4 : -2,
            y: -viewport.height * 2 + 0.5,
            z: 0,
            rotateX: 10.75,
            rotateY: 0,
            rotateZ: 1.4,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          3: {
            x: 0.2,
            y: -viewport.height * 3 + 1.2,
            z: 8.5,
            rotateX: 10.75,
            rotateY: 0,
            rotateZ: -0.8,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
        }}
      >
        <Avatar animation={characterAnimation} wireframe={section === 1} />
      </motion.group>
      <ambientLight intensity={1} />
      <directionalLight intensity={3.5} position={[25, 30, 15]} />
      <motion.group
        position={[
          isMobile ? 0 : 1.5 * officeScaleRatio,
          isMobile ? -viewport.height / 6 : 2,
          3,
        ]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        animate={{ y: isMobile ? -viewport.height / 6 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Office section={section} />
        <group
          name="CharacterSpot"
          position={[-0.05, 0.2, -0.8]}
          rotation={[-1.55, 0.05, -3.5]}
          ref={characterContainerAboutRef}
        ></group>
      </motion.group>

      {/* SKILLS */}
      <motion.group
        position={[
          0,
          isMobile ? -viewport.height : -1.5 * officeScaleRatio,
          -10,
        ]}
        animate={{
          y:
            section === 1
              ? -viewport.height
              : isMobile
              ? -viewport.height
              : -1.5 * officeScaleRatio,
          z: section === 1 ? 0 : -10,
        }}
      >
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
        <Float>
          <mesh position={[1, -3, -15]} scale={[2, 2, 2]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={0.4}
              speed={4}
              color={"red"}
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[3, 3, 3]} position={[3, 1, -18]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={1}
              speed={5}
              color="yellow"
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[1.4, 1.4, 1.4]} position={[-3, -1, -11]}>
            <boxGeometry />
            <MeshWobbleMaterial
              opacity={0.8}
              transparent
              factor={1}
              speed={5}
              color={"blue"}
            />
          </mesh>
        </Float>
      </motion.group>
    </>
  );
};
