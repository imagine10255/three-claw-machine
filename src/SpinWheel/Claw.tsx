
// 爪子组件
import {useRef} from "react";
import * as THREE from "three";
import {useBox} from "@react-three/cannon";

// 型別定義
interface ClawProps {
    position: [number, number, number]
    isGrabbing: boolean
    onPositionChange: (position: [number, number, number]) => void
}



function Claw({position, isGrabbing, onPositionChange}: ClawProps) {
    const baseRef = useRef<THREE.Group>(null)
    const [baseBody, baseApi] = useBox(() => ({
        mass: 1,
        position,
        args: [3, 0.8, 3],
        type: 'Dynamic',
        allowSleep: false,
        onCollide: (e) => {
            console.log('Claw collided', e)
        }
    }))


    const baseY = 10;
    const base2Y = 8;

    // 爪子线缆 - 调整高度
    const cableHeight = 25 // 固定高度，确保线缆总是从机器顶部垂下
    const cableThickness = 0.2

    // 爪子手臂 - 更加复杂的结构
    const armProps = isGrabbing ? [
        // 爪子内侧位置 (抓取状态)
        {position: [0.8, base2Y, 0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.3] as [number, number, number]},
        {position: [-0.8, base2Y, 0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.3] as [number, number, number]},
        {position: [0.8, base2Y, -0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.3] as [number, number, number]},
        {position: [-0.8, base2Y, -0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.3] as [number, number, number]},

        // 爪子尖端 (抓取状态)
        {position: [1, base2Y, 1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.5] as [number, number, number]},
        {position: [-1, base2Y, 1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.5] as [number, number, number]},
        {position: [1, base2Y, -1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.5] as [number, number, number]},
        {position: [-1, base2Y, -1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.5] as [number, number, number]},
    ] : [
        // 爪子外侧位置 (松开状态)
        {position: [1.5, base2Y, 1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.6] as [number, number, number]},
        {position: [-1.5, base2Y, 1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.6] as [number, number, number]},
        {position: [1.5, base2Y, -1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.6] as [number, number, number]},
        {position: [-1.5, base2Y, -1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.6] as [number, number, number]},

        // 爪子尖端 (松开状态)
        {position: [2.2, base2Y, 2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.8] as [number, number, number]},
        {position: [-2.2, base2Y, 2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.8] as [number, number, number]},
        {position: [2.2, base2Y, -2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.8] as [number, number, number]},
        {position: [-2.2, base2Y, -2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.8] as [number, number, number]},
    ]

    // 爪子连接部件
    const connectorProps = [
        {position: [0, base2Y, 0] as [number, number, number], args: [0.8, 1, 0.8] as [number, number, number]},
    ]



    return (
        <>
            {/* 爪子吊绳 - 总是从顶部垂下 */}
            <mesh position={[position[0], position[1] + 20, position[2]]} castShadow>
                <cylinderGeometry args={[cableThickness, cableThickness, cableHeight, 12]} />
                <meshStandardMaterial color="#222222" />
            </mesh>

            {/* 爪子主体 */}
            <group  position={[position[0], position[1], position[2]]}>
                {/* 爪子基座 */}
                <primitive object={baseBody} />
                <mesh position={[0, baseY, 0]} castShadow>
                    <boxGeometry args={[2.8, 0.5, 2.8]} />
                    <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* 爪子连接部分 */}
                {connectorProps.map((props, i) => (
                    <mesh key={`connector-${i}`} position={props.position} castShadow>
                        <cylinderGeometry args={[...props.args]} />
                        <meshStandardMaterial color="#777777" metalness={0.6} roughness={0.3} />
                    </mesh>
                ))}

                {/* 爪子手臂 */}
                {armProps.map((props, i) => (
                    <mesh
                        key={`arm-${i}`}
                        position={props.position}
                        rotation={props.rotation}
                        castShadow
                    >
                        <boxGeometry args={props.args} />
                        <meshStandardMaterial color="#999999" metalness={0.5} roughness={0.4} />
                    </mesh>
                ))}
            </group>
        </>
    )
}



export default Claw;
