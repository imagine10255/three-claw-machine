import {Triplet, useBox} from '@react-three/cannon';
import {useRef} from 'react';
import * as THREE from 'three';
import {Color} from 'three';

import {IArmProps} from './types';



/**
 * 單個箱子
 * @param size
 * @param position
 */
const Arm = ({
    position,
    rotation,
    args
}: IArmProps) => {

    const [ref] = useBox(() => ({
        mass: 0,
        args,
        position,
        type: 'Dynamic',
        userData: {
            tag: 'Arm',
        },
        allowSleep: false,
        collisionResponse: true,
        material: {
            friction: 0.3,
            restitution: 0.3,
        },
        onCollide: (e) => {
            // console.log('Claw collided', e.target);
            const tag = (e.body as any).userData?.tag;
            if (tag === 'Box' || tag === 'Plane') {
                console.log('arm tag', tag);
            }

        }
    }),
    useRef<THREE.Mesh>(null),
    );


    return (
        <mesh ref={ref} castShadow receiveShadow
            rotation={rotation}
        >
            <boxGeometry args={args}/>
            <meshStandardMaterial color="#999999" metalness={0.5} roughness={0.4}/>
        </mesh>
    );
};

export default Arm;
