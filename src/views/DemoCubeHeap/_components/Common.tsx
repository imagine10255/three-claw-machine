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





/**
 * Spheres
 * @param colors
 * @param number
 * @param size
 */
export const Spheres = ({colors, number, size}: InstancedGeometryProps) => {
    const [ref, {at}] = useSphere(
        () => ({
            args: [size],
            mass: 1,
            position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
        }),
        useRef<InstancedMesh>(null),
    );
    useFrame(() => at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0));
    return (
        <instancedMesh receiveShadow castShadow ref={ref} args={[undefined, undefined, number]}>
            <sphereGeometry args={[size, 48]}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </sphereGeometry>
            <meshLambertMaterial vertexColors />
        </instancedMesh>
    );
};
