import {useBox} from '@react-three/cannon';
import {Mesh} from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

import {IWallProps} from './types';


const color = '#c2cd4b';


/**
 * 牆
 * @param position
 * @param args
 * @param isBack
 */
const Wall = ({
    position,
    args,
    isBack
}: IWallProps) => {
    const [ref] = useBox<Mesh>(() => ({
        mass: 0,
        position,
        args,
        type: 'Static',
        userData: {
            tag: 'wall'
        },
    }));

    const texture = useLoader(TextureLoader, '/static/images/wall_bg.png');


    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={args} />
            {isBack ? (
                <meshStandardMaterial map={texture} side={THREE.FrontSide} />
            ) : (
                <meshStandardMaterial
                    color="#87CEEB"
                    transparent
                    opacity={0.2}
                />
            )}
        </mesh>
    );
};


export default Wall;
