import {useLoader} from '@react-three/fiber';
import {RigidBody} from '@react-three/rapier';
import {TextureLoader} from 'three';
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
    const texture = useLoader(TextureLoader, '/static/images/wall_bg.png');

    return (
        <RigidBody
            type="fixed"
            position={position}
            userData={{tag: 'Wall'}}
        >
            <mesh receiveShadow>
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
        </RigidBody>
    );
};

export default Wall;
