import {RapierRigidBody, RigidBody} from '@react-three/rapier';
import {RefObject, useEffect, useImperativeHandle, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

import {useMyRopeJoint} from '@/views/ClawMachine/_components/Claw/hooks';

import {IArm2Props, IArm3Props, IArmProps, TPosition, TRotation} from './types';
import {IPosition} from "@/views/ClawMachine";

export interface IArmRefProps {
    setGrab: (isGrab: boolean) => void
}

interface IProps {
    position?: TPosition
    rotation?: TRotation
    controlRef: RefObject<IArmRefProps|null>
}


/**
 * 單個箱子
 * @param size
 * @param position
 */
const Arm = ({
    position,
    rotation,
    controlRef,
}: IProps) => {

    const mesh1Ref = useRef<THREE.Mesh>(null);
    const mesh2Ref = useRef<THREE.Mesh>(null);
    const isGrabbing = useRef(false);
    const animationProgress = useRef(0);

    const arg1Height = 1.5;
    const arg2Height = 2;

    const arm1 = {
        args: [.4, arg1Height, .2] as IArmProps['args'],
        idle: {
            rotation: [-0.6, 0, 0] as TRotation,
        },
        grab: {
            rotation: [-1.2, 0, 0] as TRotation,
        },
    };
    const arm2 = {
        args: [.4, arg2Height, .2] as IArmProps['args'],
        idle: {
            position: [0,-1.4,.8] as TPosition,
            rotation: [.5, 0, 0] as TRotation,
        },
        grab: {
            position: [0,-1.2,1.6] as TPosition,
            rotation: [-0.2, 0, 0] as TRotation,
        }
    };




    useImperativeHandle(controlRef, () => ({
        setGrab,
    }));


    useFrame((state, delta) => {
        if (!mesh1Ref.current || !mesh2Ref.current) return;

        const targetProgress = isGrabbing.current ? 1 : 0;
        animationProgress.current = THREE.MathUtils.lerp(
            animationProgress.current,
            targetProgress,
            delta * 5 // 控制动画速度
        );

        // 第一段爪子的旋转
        const arm1Rotation = new THREE.Euler();
        arm1Rotation.setFromVector3(
            new THREE.Vector3(
                THREE.MathUtils.lerp(arm1.idle.rotation[0], arm1.grab.rotation[0], animationProgress.current),
                arm1.idle.rotation[1],
                arm1.idle.rotation[2]
            )
        );
        mesh1Ref.current.rotation.copy(arm1Rotation);

        // 第二段爪子的位置和旋转
        const arm2Position = new THREE.Vector3();
        arm2Position.set(
            THREE.MathUtils.lerp(arm2.idle.position[0], arm2.grab.position[0], animationProgress.current),
            THREE.MathUtils.lerp(arm2.idle.position[1], arm2.grab.position[1], animationProgress.current),
            THREE.MathUtils.lerp(arm2.idle.position[2], arm2.grab.position[2], animationProgress.current)
        );
        mesh2Ref.current.position.copy(arm2Position);

        const arm2Rotation = new THREE.Euler();
        arm2Rotation.setFromVector3(
            new THREE.Vector3(
                THREE.MathUtils.lerp(arm2.idle.rotation[0], arm2.grab.rotation[0], animationProgress.current),
                arm2.idle.rotation[1],
                arm2.idle.rotation[2]
            )
        );
        mesh2Ref.current.rotation.copy(arm2Rotation);
    });

    const setGrab = (isGrab: boolean) => {
        isGrabbing.current = isGrab;
    };



    return <group
        position={position}
        rotation={rotation}
    >
        <mesh
            ref={mesh1Ref}
            position={[0,0,.8]}
            castShadow
            receiveShadow
            {...arm1.idle}
        >
            <boxGeometry args={arm1.args} />
            <meshStandardMaterial color="#999999" />
        </mesh>

        <mesh
            ref={mesh2Ref}
            castShadow
            receiveShadow
            {...arm2.idle}
        >
            <boxGeometry args={arm2.args} />
            <meshStandardMaterial color="red" />
        </mesh>

    </group>;
};



// const Arms = () => {
//     return <group>
//         <Arm position={[0.8, 1, 0.8]} rotation={[0, 0, 0.3]} />
//     </group>;
// };

export default Arm;

