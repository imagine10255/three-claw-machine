import {PlaneProps, Triplet, useBox, usePlane} from '@react-three/cannon';
import {useRef} from 'react';
import type {Mesh} from 'three';


const args: Triplet = [10, .1, 10];

/**
 * Plane
 */
const Plane = () => {
    const [ref] = useBox<Mesh>(() => ({
        mass: 0,
        position: [0, 0, 0],
        args,
        type: 'Static'
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#8B4513" />
        </mesh>
    );
};


export default Plane;

