import {useBox} from '@react-three/cannon';
import {Mesh} from 'three';

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

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={args} />
            {isBack ? (
                // 墙壁壁纸样式
                <meshStandardMaterial
                    color={color}
                    roughness={0.8}
                    metalness={0.2}
                />
            ) : (
                // 玻璃样式
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
