import {RapierRigidBody, RigidBody} from '@react-three/rapier';
import {RefObject, useEffect, useImperativeHandle, useRef} from 'react';
import * as THREE from 'three';

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


    /**
     * 張開
     */
    const setGrab = (isGrab: boolean) => {
        if(isGrab){
            // 更改 mesh1Ref
            // rotation={[-1.2, 0, 0]}

            // 更改 mesh2Ref
            // position={[0,-1.2,1.6]}
            // rotation={[-0.2, 0, 0]}
        }else{
            // 更改 mesh1Ref
            // rotation={[-0.6, 0, 0]}

            // 更改 mesh2Ref
            // position={[0,-1.4,.8]}
            // rotation={[.5, 0, 0]}


        }

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

