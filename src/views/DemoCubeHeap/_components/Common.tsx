import {PlaneProps, usePlane, useSphere} from '@react-three/cannon';
import {useFrame} from '@react-three/fiber';
import {useRef} from 'react';
import type {InstancedMesh, Mesh} from 'three';

import {InstancedGeometryProps} from '@/views/DemoCubeHeap/types';


/**
 * Plane
 * @param props
 */
export function Plane(props: PlaneProps) {
    const [ref] = usePlane(() => ({...props}), useRef<Mesh>(null));
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial color="#171717" />
        </mesh>
    );
}




