
// 地板
import {usePlane} from "@react-three/cannon";

function Floor() {
    const [ref] = usePlane<any>(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -1, 0],
        type: 'Static'
    }))

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#666666" />
        </mesh>
    )

}


export default Floor
