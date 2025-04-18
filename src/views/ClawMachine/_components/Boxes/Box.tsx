import {RigidBody} from '@react-three/rapier';
import * as THREE from 'three';
import {Color} from 'three';

interface IProps {
    size: number
    position: [number, number, number]
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
    const args: [number, number, number] = [size, size, size];
    const boxColor = new Color(...color);

    return (
        <RigidBody
            position={position}
            type="dynamic"
            colliders="cuboid"
            canSleep={false}
            enabledRotations={[true, true, true]}
            friction={0.3}
            restitution={0.3}
            userData={{
                tag: 'Box',
                id: index
            }}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={args} />
                <meshLambertMaterial color={boxColor} />
            </mesh>
        </RigidBody>
    );
};

export default Box;
