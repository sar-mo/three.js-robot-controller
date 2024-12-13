import { Perf } from 'r3f-perf';
import { useControls } from 'leva';
import { Grid, Center, GizmoHelper, GizmoViewport, OrbitControls, Environment, useHelper, ContactShadows } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import CharacterController from './CharacterController';
import { Leva } from 'leva';
import { PointLightHelper } from 'three';
import { useRef } from 'react';

export default function Experience() {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: '#6f6f6f',
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: '#9d4b4b',
    fadeDistance: { value: 40, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true
  });

  const { enableCamera } = useControls({
    enableCamera: false
  });

  const { enableRotation, enableAnimations, enableMouse } = useControls({
    enableRotation: false,
    enableAnimations: false,
    enableMouse: false
  });

  const pointLight1Ref = useRef();
  const pointLight2Ref = useRef();

  // Use helpers to visualize the point lights
  useHelper(pointLight1Ref, PointLightHelper, 1);
  useHelper(pointLight2Ref, PointLightHelper, 1);

  return (
    <>
      <Perf position="top-left" />

      {/* Lights */}
      <pointLight
        ref={pointLight1Ref}
        position={[5, 5, 5]}
        intensity={50}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        ref={pointLight2Ref}
        position={[-5, 5, -5]}
        intensity={50}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Main Scene */}
      <RigidBody colliders="ball">
        <mesh castShadow position={[1, 1, 0]}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial color="#9d4b4b" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh receiveShadow rotation={[0, Math.PI / 4, 0]} position={[-1, -0.5, 0]}>
          <boxGeometry args={[0.7, 0.2, 0.7]} />
          <meshStandardMaterial colodwer="#9d4b4b" />
        </mesh>
      </RigidBody>

      <RigidBody>
        <mesh receiveShadow rotation={[0, Math.PI / 4, 0]} position={[-1, -0.5, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
          <meshStandardMaterial colodwer="#9d4b4b" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <boxGeometry args={[100, 100, 1]} />
          <meshStandardMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </RigidBody>

      <Grid position={[0, -0.5, 0]} args={gridSize} {...gridConfig} />

      {/* Shadows */}
      <ContactShadows
        position={[0, -0.6, 0]}
        opacity={1}
        scale={50}
        blur={1.5}
        far={10}
      />

      {/* Character Controller */}
      <CharacterController
        enableRotation={enableRotation}
        enableAnimations={enableAnimations}
        enableMouse={enableMouse}
      />

      {/* Camera */}
      {enableCamera && <OrbitControls makeDefault />}

      <Environment preset="city" />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
      </GizmoHelper>
    </>
  );
}