import {Triplet, useBox} from '@react-three/cannon';
import {BufferGeometry, Mesh, NormalBufferAttributes, Object3D, Object3DEventMap} from 'three';


interface IWallProps {
    position: Triplet
    args: Triplet
    isBack?: boolean
}


/**
 * 娃娃機壁
 */
const Walls = () => {
    const wallProps: IWallProps[] = [
        {
            // 后壁 - 改为墙壁壁纸
            position: [0, 0, 10],
            args: [20, 12, 0.5],
        },
        {
            // 前壁 - 保持玻璃
            position: [0, 0, -10],
            args: [20, 12, 0.5],
            isBack: true,
        },
        {
            // 右壁 - 保持玻璃
            position: [10, 7, 0],
            args: [0.5, 12, 20]
        },
        {
            // 左壁 - 保持玻璃
            position: [-10, 0, 0],
            args: [0.5, 12, 20]
        }
    ]

    ;

    return (
        <>
            {wallProps.map((props, i) => {
                return <Wall key={i}
                    position={
                        [
                            props.position[0],
                            props.args[1] / 2,
                            props.position[2]
                        ]
                    }
                    args={props.args}
                    isBack={props.isBack}
                />;
            })}
        </>
    );
};


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
                    color="#8B4513" 
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

export default Walls;
