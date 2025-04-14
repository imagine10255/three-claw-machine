
// 娃娃機底座
import {useBox} from "@react-three/cannon";

function Base() {
    const [ref] = useBox<any>(() => ({
        mass: 0,
        position: [0, 0, 0],
        args: [20, 2, 20],
        type: 'Static'
    }))

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={[20, 2, 20]} />
            <meshStandardMaterial color="#8B4513" />
        </mesh>
    )
}


export default Base;
