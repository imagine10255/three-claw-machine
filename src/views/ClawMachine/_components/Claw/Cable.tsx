import {useFrame} from '@react-three/fiber';
import {useRef} from 'react';
import * as THREE from 'three';

interface Props {
    length: number;
    position: [number, number, number];
}

const Cable = ({length, position}: Props) => {
    const cableRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (cableRef.current) {
            cableRef.current.position.set(...position);
        }
    });

    return (
        <mesh ref={cableRef}>
            <cylinderGeometry args={[0.1, 0.1, length, 8]} />
            <meshStandardMaterial color="#666666" />
        </mesh>
    );
};

export default Cable; 