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
    const ref1 = useRef<RapierRigidBody>(null); // prettier-ignore
    const ref2 = useRef<RapierRigidBody>(null); // prettier-ignore

    const arg1Height = 1.5;
    const arg2Height = 2;

    const arm1 = {
        y: arg1Height / -2,
        args: [.4, arg1Height, .2] as IArmProps['args'],
    };
    const arm2 = {
        y: (arg1Height) + (arg2Height / -2) * .6,
        args: [.4, arg2Height, .2] as IArmProps['args'],
    };


    const armProps: IArm2Props[] = [
        {
            position: [0, 0, 0],
            args: arm1.args,
            rotation: [-0.6, 0, 0]
        },
        {
            position: [0, -1.4, 0],
            args: arm2.args,
            rotation: [.5, 0, 0]
        }
    ];


    const {createImpulseJoint} = useMyRopeJoint();

    // useEffect(() => {
    //     createImpulseJoint(
    //         'spherical',
    //         [
    //             {ref: ref1, anchor: [.4, arg1Height, .2]},
    //             {ref: ref2, anchor: [0,0,0]},
    //         ]
    //     );
    // }, []);

    return <group
        position={position}
        // rotation={[0,1,0]}
        rotation={rotation}
    >
        <mesh
            // position={armProps[0].position}
            position={[0,0,.8]}
            // rotation={[0,0,0]}
            rotation={armProps[0].rotation}
            castShadow
            receiveShadow
        >
            <boxGeometry args={armProps[0].args} />
            <meshStandardMaterial color="#999999" />
        </mesh>

        <mesh
            position={[0,-1.4,.8]}
            rotation={armProps[1].rotation}
            castShadow
            receiveShadow
        >
            <boxGeometry args={armProps[1].args} />
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

