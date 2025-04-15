import {useBox} from '@react-three/cannon';
import {BufferGeometry, Mesh, NormalBufferAttributes, Object3D, Object3DEventMap} from 'three';



// 娃娃機壁
function Walls() {
    const wallProps = [
        {position: [0, 7, 10] as [number, number, number], args: [20, 12, 0.5] as [number, number, number]}, // 后壁
        {position: [0, 7, -10] as [number, number, number], args: [20, 12, 0.5] as [number, number, number]}, // 前壁
        {position: [10, 7, 0] as [number, number, number], args: [0.5, 12, 20] as [number, number, number]}, // 右壁
        {position: [-10, 7, 0] as [number, number, number], args: [0.5, 12, 20] as [number, number, number]} // 左壁
    ];

    return (
        <>
            {wallProps.map((props, i) => (
                <Wall key={i} position={props.position} args={props.args} />
            ))}
        </>
    );
}


function Wall({position, args}: {position: [number, number, number], args: [number, number, number]}) {
    const [ref] = useBox<Mesh>(() => ({
        mass: 0,
        position,
        args,
        type: 'Static'
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.2} />
        </mesh>
    );
}

export default Walls;
