import {Triplet, useBox} from '@react-three/cannon';
import {useRef} from 'react';
import * as THREE from 'three';
import {Color} from 'three';


interface IProps {
    size: number
    position: Triplet
    color: [number, number, number]
    index: number
}

/**
 * 單個箱子
 * @param size
 * @param position
 * @param color
 * @param index
 */
const Box = ({
    size,
    position,
    color,
    index
}: IProps) => {
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

export default Box;
