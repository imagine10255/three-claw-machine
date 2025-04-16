import {PlaneProps, Triplet, useBox, usePlane} from '@react-three/cannon';
import {useRef} from 'react';
import  {Mesh} from 'three';
import * as THREE from 'three';

import {IPlaneProps} from './types';


/**
 * Plane
 */
const Plane = ({
    position,
    args,
    color,
}: IPlaneProps) => {

    const [ref] = useBox(() => ({
        mass: 0,
        position: position,
        args: args,
        type: 'Static',
        userData: {
            tag: 'Plane'
        },
    }),
    useRef<THREE.Mesh>(null),
    );

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};


export default Plane;

