import {Triplet, useBox} from '@react-three/cannon';
import {useFrame} from '@react-three/fiber';
import {useEffect, useRef} from 'react';
import type {InstancedMesh} from 'three';

interface InstancedGeometryProps {
    colors: Float32Array
    number: number
    size: number
}


/**
 * Boxes
 * @param colors
 * @param number
 * @param size
 */
const Boxes = ({
    colors,
    number,
    size
}: InstancedGeometryProps) => {
    const args: Triplet = [size, size, size];
    const [ref, {at}] = useBox(
        () => ({
            args,
            mass: 1,
            position: [
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 10
            ],
            userData: {
                tag: 'box'
            },
            allowSleep: false,
            collisionResponse: true,
            material: {
                friction: 0.3,
                restitution: 0.3
            }
        }),
        useRef<InstancedMesh>(null),
    );


    // useFrame(() => {
    //    // 一直產出
    //     at(Math.floor(Math.random() * number)).position.set(0, Math.random() * 2, 0);
    // });

    useEffect(() => {
        at(Math.floor(Math.random() * number)).position.set(
            (Math.random() - 0.5) * 10,
            Math.random() * 5 + 2,
            (Math.random() - 0.5) * 10
        );
    }, []);


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
