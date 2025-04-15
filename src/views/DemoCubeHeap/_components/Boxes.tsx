import {Triplet, useBox} from '@react-three/cannon';
import {useFrame} from '@react-three/fiber';
import {useRef} from 'react';
import type {InstancedMesh} from 'three';

import {InstancedGeometryProps} from '../types';


/**
 * Boxes
 * @param colors
 * @param number
 * @param size
 */
const Boxes = ({
    colors, number, size
}: InstancedGeometryProps) => {
    const args: Triplet = [size, size, size];
    const [ref, {at}] = useBox(
        () => ({
            args,
            mass: 1,
            position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
        }),
        useRef<InstancedMesh>(null),
    );
    useFrame(() => at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0));
    return (
        <instancedMesh receiveShadow castShadow ref={ref} args={[undefined, undefined, number]}>
            <boxGeometry args={args}>
                <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
            </boxGeometry>
            <meshLambertMaterial vertexColors />
        </instancedMesh>
    );
};

export default Boxes;
