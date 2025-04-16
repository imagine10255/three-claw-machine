import {RigidBody} from '@react-three/rapier';

import {IArmProps} from './types';

/**
 * 單個箱子
 * @param size
 * @param position
 */
const Arm = ({
    position,
    rotation,
    args
}: IArmProps) => {
    return (
        <RigidBody
            type="dynamic"
            position={position}
            colliders="cuboid"
            canSleep={false}
            friction={0.3}
            restitution={0.3}
            userData={{tag: 'Arm'}}
            onCollisionEnter={(e) => {
                const tag = e.rigidBody?.userData;
                // console.log('arm tag:', tag);
                if (tag === 'Box' || tag === 'Plane') {
                    // 處理碰撞邏輯
                }
            }}
        >
            <mesh
                castShadow
                receiveShadow
                rotation={rotation}
            >
                <boxGeometry args={args} />
                <meshStandardMaterial color="#999999" />
            </mesh>
        </RigidBody>
    );
};

export default Arm;
