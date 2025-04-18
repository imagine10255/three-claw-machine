import {RigidBody} from '@react-three/rapier';

import {IPlaneProps} from './types';

/**
 * Plane
 */
const Plane = ({
    position,
    args,
    color,
}: IPlaneProps) => {

    return (
        <RigidBody
            type="fixed"
            position={position}
            userData={{tag: 'Plane'}}
            colliders="cuboid"
            // friction={0.3}
            // restitution={0.3}
        >
            <mesh receiveShadow>
                <boxGeometry args={args} />
                <meshStandardMaterial color={color} />
            </mesh>
        </RigidBody>
    );
};

export default Plane;
