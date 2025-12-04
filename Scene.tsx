import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { InstancedTree } from './components/InstancedTree';
import { MemoryLocket } from './components/MemoryLocket';
import { generateLocketData } from './utils/geometry';
import { useStore } from './store';
import { easing } from 'maath';

// Separate component to handle lighting animations
const LightingController: React.FC = () => {
  const { activeLocketId } = useStore();
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  
  // We use a dummy object to animate the environment intensity since Environment doesn't expose a direct ref easily accessible for damping
  // However, simpler is to just control the lights we added.
  // We will assume the Environment contributes to ambient.

  useFrame((state, delta) => {
    // Target intensities
    // If active: Dim background by ~30%
    const targetSpotIntensity = activeLocketId ? 140 : 200;
    const targetAmbientIntensity = activeLocketId ? 0.3 : 0.5;
    
    if (spotLightRef.current) {
      easing.damp(spotLightRef.current, 'intensity', targetSpotIntensity, 0.5, delta);
    }
    if (ambientLightRef.current) {
      easing.damp(ambientLightRef.current, 'intensity', targetAmbientIntensity, 0.5, delta);
    }
  });

  return (
    <>
      <Environment preset="city" environmentIntensity={activeLocketId ? 0.7 : 1} /> 
      <ambientLight ref={ambientLightRef} intensity={0.5} color="#042e1f" />
      <spotLight 
        ref={spotLightRef}
        position={[10, 20, 10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={200} 
        color="#ffd700" 
        castShadow 
      />
      {/* Rim/Fill Light */}
      <pointLight position={[-10, 0, -10]} intensity={activeLocketId ? 30 : 50} color="#00ffcc" />
    </>
  );
};

export const Scene: React.FC = () => {
  const { activeLocketId } = useStore();
  const locketData = useMemo(() => generateLocketData(), []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 35], fov: 35 }}
      gl={{ antialias: false, toneMappingExposure: 1.2 }}
    >
      <color attach="background" args={['#000500']} />
      
      {/* Lighting Controller manages dynamic dimming */}
      <LightingController />

      {/* --- Objects --- */}
      <InstancedTree />
      
      {locketData.map((data) => (
        <MemoryLocket key={data.id} data={data} />
      ))}
      
      {/* Floor Reflections */}
      <ContactShadows 
        resolution={1024} 
        scale={50} 
        blur={2} 
        opacity={0.5} 
        far={10} 
        color="#000000" 
      />

      {/* Atmosphere particles */}
      <Sparkles count={200} scale={30} size={4} speed={0.4} opacity={0.5} color="#ffd700" />

      {/* --- Controls --- */}
      {/* Disable controls when looking at a locket for focus */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={!activeLocketId} 
        autoRotate={!activeLocketId}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />

      {/* --- Post Processing (Cinematic Look) --- */}
      <EffectComposer disableNormalPass>
        {/* Glow */}
        <Bloom 
            luminanceThreshold={1.1} // Only very bright things glow
            mipmapBlur 
            intensity={1.5} 
            radius={0.6}
        />
        <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={0.4} 
            radius={0.8}
        />
        
        {/* Film grain for texture */}
        <Noise opacity={0.05} />
        
        {/* Focus the eye */}
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};