import {RapierRigidBody, RigidBody} from '@react-three/rapier';
import {ForwardedRef, useRef} from 'react';
import * as THREE from 'three';

import {IClawRefProps} from '@/views/ClawMachine/_components/Claw/types';

interface IProps {
    ref: ForwardedRef<RapierRigidBody>
    length: number
    position: [number, number, number]
}

const Cable = ({
    ref,
    length,
    position,
}: IProps) => {

    return (
        <RigidBody
            ref={ref}
            type="dynamic"
            // position={[clawPosition.current[0], initY - cableLength, clawPosition.current[2]]}
            colliders="cuboid"
            canSleep={false}
            userData={{tag: 'Claw'}}
            lockRotations // 锁定旋转
            gravityScale={0} // 设置重力缩放为0，这样就不会受重力影响
            friction={5.5} // 增加摩擦力
            linearDamping={5.5} // 增加线性阻尼
        >
            <mesh ref={ref} position={position}>
                <cylinderGeometry args={[0.05, 0.05, length, 16]} />
                <meshStandardMaterial
                    color="#888888"
                    metalness={0.3}
                    roughness={0.7}
                />
            </mesh>
        </RigidBody>
    );
};

export default Cable;
