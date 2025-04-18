import {ForwardedRef, useRef} from 'react';
import * as THREE from 'three';

import {IClawRefProps} from '@/views/ClawMachine/_components/Claw/types';

interface IProps {
    ref: ForwardedRef<THREE.Mesh>
    length: number
    position: [number, number, number]
}

const Cable = ({
    ref,
    length,
    position,
}: IProps) => {

    return (
        <mesh ref={ref} position={position}>
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
