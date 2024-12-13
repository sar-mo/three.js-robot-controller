import { PivotControls, useKeyboardControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useControls } from 'leva';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

// Position based, because I eventually want to create a spider robot using IK
export default function CharacterController({ enableRotation = false, enableAnimations = false, enableMouse = false }) {
    const { WALK_SPEED, RUN_SPEED } = useControls(
        "Character Control",
        {
            WALK_SPEED: { value: 4, min: 0.1, max: 10, step: 0.1 },
            RUN_SPEED: { value: 12, min: 0.2, max: 20, step: 0.1 },
        }
    );

    const { capsuleHeight, capsuleRadius } = useControls(
        "Capsule",
        {
            capsuleHeight: { value: 0.45, min: 0.1, max: 10, step: 0.01 },
            capsuleRadius: { value: 0.4, min: 0.1, max: 10, step: 0.01 },
        }
    );

    const container = useRef();
    const cameraTarget = useRef();
    const cameraPosition = useRef();
    const character = useRef();
    const rb = useRef();
    const [, get] = useKeyboardControls();
    const isClicking = useRef(false);

    const targetPosition = useRef(new Vector3());

    useEffect(() => {
        const onMouseDown = () => { isClicking.current = true; }
        const onMouseUp = () => { isClicking.current = false; }
        if (enableMouse) {
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchstart', onMouseDown);
            document.addEventListener('touchend', onMouseUp);
        }
        return () => {
            if (enableMouse) {
                document.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchstart', onMouseDown);
                document.removeEventListener('touchend', onMouseUp);
            }
        };
    }, [enableMouse]);

    useFrame(({ camera, pointer }) => {
        if (rb.current) {
            const speed = get().run ? RUN_SPEED : WALK_SPEED;

            // Get current position
            const currentPosition = rb.current.translation();

            // Movement input
            const movement = { x: 0, z: 0 };
            if (get().forward) movement.z += 1;
            if (get().backward) movement.z -= 1;
            if (get().leftward) movement.x += 1;
            if (get().rightward) movement.x -= 1;

            if (enableMouse && isClicking.current) {
                movement.x = -pointer.x;
                movement.z = pointer.y + 0.2;
            }

            if (movement.x !== 0 || movement.z !== 0) {
                // Calculate new position
                targetPosition.current.set(
                    currentPosition.x + speed * movement.x * 0.01,
                    currentPosition.y,
                    currentPosition.z + speed * movement.z * 0.01
                );

                // Update the position
                rb.current.setTranslation(targetPosition.current, true);
            }
        }

        // Camera follows the character
        if (cameraPosition.current) {
            camera.position.lerp(cameraPosition.current.getWorldPosition(new Vector3()), 0.1);
        }
        if (cameraTarget.current) {
            camera.lookAt(cameraTarget.current.getWorldPosition(new Vector3()));
        }
    });

    return (
        <RigidBody colliders={false} position={[2, 0, 2]} lockRotations ref={rb}>
            <group ref={container}>
                <group ref={cameraTarget} position-z={1.5} />
                <group ref={cameraPosition} position-y={15} position-z={-25} />
                <group ref={character}>
                    <mesh castShadow>
                        <capsuleGeometry args={[0.4, 0.7, 4, 18]} />
                        <meshStandardMaterial color="#9d4b4b" />
                    </mesh>
                </group>
            </group>
            <CapsuleCollider args={[capsuleHeight, capsuleRadius]} />
        </RigidBody>
    );
}
