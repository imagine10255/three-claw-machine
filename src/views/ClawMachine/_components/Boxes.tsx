import {Triplet, useBox} from '@react-three/cannon';
import {useMemo, useRef} from 'react';
import {Color} from 'three';
import * as THREE from 'three';

interface InstancedGeometryProps {
    colors: Float32Array
    number: number
    size: number
}

const SingleBox = ({
    size,
    position,
    color,
    index
}: {
    size: number,
    position: Triplet,
    color: [number, number, number],
    index: number,
}) => {
    const args: Triplet = [size, size, size];

    const [ref] = useBox(() => ({
        mass: 1,
        args,
        position,
        type: 'Dynamic',
        userData: {
            tag: 'Box',
            id: index,
        },
        allowSleep: false,
        collisionResponse: true,
        material: {
            friction: 0.3,
            restitution: 0.3,
        },
        // onCollide: (e) => {
        //     console.log(`Box ${index} 碰撞到`, e.body?.userData?.tag);
        // }
    }),
    useRef<THREE.Mesh>(null),
    );

    const boxColor = new Color(...color);

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshLambertMaterial color={boxColor} />
        </mesh>
    );
};

const Boxes = ({colors, number, size}: InstancedGeometryProps) => {
    const boxes = useMemo(() => {
        return Array.from({length: number}, (_, i) => {
            const position: Triplet = [
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 10
            ];
            const color: [number, number, number] = [
                colors[i * 3],
                colors[i * 3 + 1],
                colors[i * 3 + 2]
            ];
            return {position, color, index: i};
        });
    }, [number, size, colors]);

    return (
        <>
            {boxes.map(({position, color, index}) => (
                <SingleBox key={index} position={position} color={color} size={size} index={index} />
            ))}
        </>
    );
};

export default Boxes;
