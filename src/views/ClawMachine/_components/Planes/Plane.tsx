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
        >
            <mesh receiveShadow>
                <boxGeometry args={args} />
                <meshStandardMaterial color={color} />
            </mesh>
        </RigidBody>
    );
};

export default Plane;
