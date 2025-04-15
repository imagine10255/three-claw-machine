import {Triplet, useBox} from '@react-three/cannon';
import {BufferGeometry, Mesh, NormalBufferAttributes, Object3D, Object3DEventMap} from 'three';


interface IWallProps {
    position: Triplet
    args: Triplet
}


/**
 * 娃娃機壁
 */
const Walls = () => {
    const wallProps: IWallProps[] = [
        {
            // 后壁
            position: [0, 0, 10],
            args: [20, 12, 0.5]
        },
        {
            // 前壁
            position: [0, 0, -10],
            args: [20, 12, 0.5]
        },
        {
            // 右壁
            position: [10, 7, 0],
            args: [0.5, 12, 20]
        },
        {
            // 左壁
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
                />;
            })}
        </>
    );
};


/**
 * 牆
 * @param position
 * @param args
 */
const Wall = ({
    position,
    args
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
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.2} />
        </mesh>
    );
};

export default Walls;
