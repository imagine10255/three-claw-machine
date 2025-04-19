import {RapierRigidBody, RigidBody} from '@react-three/rapier';
import {useEffect, useRef} from 'react';

import {useMyRopeJoint} from '@/views/ClawMachine/_components/Claw/hooks';

import {IArm2Props, IArm3Props, IArmProps} from './types';

/**
 * 單個箱子
 * @param size
 * @param position
 */
const Arm = ({
    position,
    rotation,
}: IArm3Props) => {
    const arg1Height = 1.5;
    const arg2Height = 2;

    const arm1 = {
        args: [.4, arg1Height, .2] as IArmProps['args'],
    };
    const arm2 = {
        args: [.4, arg2Height, .2] as IArmProps['args'],
    };



    return <group
        position={position}
        rotation={rotation}
    >
        <mesh
            position={[0,0,.8]}
            rotation={[-0.6, 0, 0]}
            castShadow
            receiveShadow
        >
            <boxGeometry args={arm1.args} />
            <meshStandardMaterial color="#999999" />
        </mesh>

        <mesh
            position={[0,-1.4,.8]}
            rotation={[.5, 0, 0]}
            castShadow
            receiveShadow
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

