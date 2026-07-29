import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import * as THREE from "three";

function Ring({
  position,
  color,
  scale = 1,
  rotationOffset = 0,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  rotationOffset?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.4 + rotationOffset;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    const mx = state.mouse.x * 0.3;
    const my = state.mouse.y * 0.2;
    ref.current.position.x = position[0] + mx;
    ref.current.position.y = position[1] + my;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <torusGeometry args={[1, 0.18, 64, 200]} />
        <meshPhysicalMaterial
          color={color}
          metalness={1}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.6}
        />
      </mesh>
      {/* Diamond on top ring */}
      {scale < 1 && (
        <mesh position={[position[0], position[1] + 1.05, position[2]]} scale={0.16}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0}
            transmission={0.9}
            thickness={0.5}
            ior={2.4}
            clearcoat={1}
          />
        </mesh>
      )}
    </Float>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#fff9fa"]} />
      <fog attach="fog" args={["#fff9fa", 7, 15]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} castShadow color="#fff1f3" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#d8a7b1" />
      <pointLight position={[0, -2, 3]} intensity={0.7} color="#f6d5dc" />

      <Ring position={[-1.1, 0.2, 0]} color="#f0c4cd" scale={0.95} />
      <Ring position={[1.1, -0.1, 0]} color="#efd9a0" scale={0.85} rotationOffset={Math.PI / 3} />

      <Sparkles count={60} scale={[8, 4, 4]} size={3} speed={0.4} color="#c9a227" />
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.25}
        scale={8}
        blur={2.8}
        far={4}
        color="#d8a7b1"
      />
      <Environment preset="studio" />
    </>
  );
}

export function Rings3D() {
  const { lang } = useLang();
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80"
        >
          {lang === "en" ? "Sealed in gold" : "مختوم بالذهب"}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 font-display text-4xl italic text-gradient-gold sm:text-6xl"
        >
          {lang === "en" ? "Two rings, one promise" : "خاتمان، وعدٌ واحد"}
        </motion.h2>

        <div className="mt-12 relative h-[460px] w-full overflow-hidden rounded-3xl glass-gold sm:h-[560px]">
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 45%, rgba(246,213,220,0.55) 100%)",
            }}
          />
          <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 0.2, 4.2], fov: 45 }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground/40">
            {lang === "en" ? "Move your cursor" : "حرّك المؤشر"}
          </p>
        </div>
      </div>
    </section>
  );
}
