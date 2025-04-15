import {PlaneProps, usePlane} from '@react-three/cannon';
import {useRef} from 'react';
import type {Mesh} from 'three';



/**
 * Plane
 * @param props
 */
const Plane = (props: PlaneProps) => {
    const [ref] = usePlane(() => ({...props}), useRef<Mesh>(null));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial color="#171717" />
        </mesh>
    );
};


export default Plane;

