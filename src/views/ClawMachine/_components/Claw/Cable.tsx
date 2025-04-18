import {useFrame} from '@react-three/fiber';
import {useRef} from 'react';
import * as THREE from 'three';

interface Props {
    length: number
    position: [number, number, number]
}

const Cable = ({
    length, position
}: Props) => {
    const cableRef = useRef<THREE.Mesh>(null);

    return (
        <mesh ref={cableRef} position={position}>
            <cylinderGeometry args={[0.05, 0.05, length, 16]} />
            <meshStandardMaterial
                color="#888888"
                metalness={0.3}
                roughness={0.7}
            />
        </mesh>
    );
};

export default Cable;
