// 爪子组件
import {useRef, useState, useImperativeHandle, forwardRef, ForwardedRef} from "react";
import * as THREE from "three";
import { useBox } from "@react-three/cannon";
import {MeshProps, useFrame} from "@react-three/fiber";

// 型別定義
interface ClawProps {
    position: [number, number, number]
    isGrabbing: boolean
    onPositionChange: (position: [number, number, number]) => void
}

const Claw = ({
      position,
      isGrabbing,
      onPositionChange
}: ClawProps, ref: ForwardedRef<MeshProps>) => {
    const baseRef = useRef<THREE.Group>(null);
    const cableRef = useRef<THREE.Mesh>(null);
    const [targetY, setTargetY] = useState(position[1]);
    const [baseBody, baseApi] = useBox(() => ({
        mass: 1,
        position,
        args: [3, 0.8, 3],
        type: 'Dynamic',
        allowSleep: false,
        onCollide: (e) => {
            console.log('Claw collided', e)
        }
    }));

    const baseY = 10;
    const base2Y = 8;

    // 爪子线缆 - 调整高度
    const cableHeight = 25 // 固定高度，确保线缆总是从机器顶部垂下
    const cableThickness = 0.2

    // 爪子手臂 - 更加复杂的结构
    const armProps = isGrabbing ? [
        // 爪子内侧位置 (抓取状态)
        { position: [0.8, base2Y, 0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.3] as [number, number, number] },
        { position: [-0.8, base2Y, 0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.3] as [number, number, number] },
        { position: [0.8, base2Y, -0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.3] as [number, number, number] },
        { position: [-0.8, base2Y, -0.8] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.3] as [number, number, number] },

        // 爪子尖端 (抓取状态)
        { position: [1, base2Y, 1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.5] as [number, number, number] },
        { position: [-1, base2Y, 1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.5] as [number, number, number] },
        { position: [1, base2Y, -1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.5] as [number, number, number] },
        { position: [-1, base2Y, -1] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.5] as [number, number, number] },
    ] : [
        // 爪子外侧位置 (松开状态)
        { position: [1.5, base2Y, 1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.6] as [number, number, number] },
        { position: [-1.5, base2Y, 1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.6] as [number, number, number] },
        { position: [1.5, base2Y, -1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, 0.6] as [number, number, number] },
        { position: [-1.5, base2Y, -1.5] as [number, number, number], args: [0.4, 2.5, 0.4] as [number, number, number], rotation: [0, 0, -0.6] as [number, number, number] },

        // 爪子尖端 (松开状态)
        { position: [2.2, base2Y, 2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.8] as [number, number, number] },
        { position: [-2.2, base2Y, 2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.8] as [number, number, number] },
        { position: [2.2, base2Y, -2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, 0.8] as [number, number, number] },
        { position: [-2.2, base2Y, -2.2] as [number, number, number], args: [0.3, 0.8, 0.3] as [number, number, number], rotation: [0, 0, -0.8] as [number, number, number] },
    ]

    // 爪子连接部件
    const connectorProps = [
        { position: [0, base2Y, 0] as [number, number, number], args: [0.8, 1, 0.8] as [number, number, number] },
    ]

    const currentPosition = useRef<THREE.Vector3>(new THREE.Vector3(position[0], position[1], position[2]));

    useFrame((state, delta) => {
        if (!baseRef.current || !cableRef.current) return;

        const speed = 5;
        const step = speed * delta;

        currentPosition.current.lerp(new THREE.Vector3(position[0], position[1], position[2]), 0.1);

        baseRef.current.position.copy(currentPosition.current);
        cableRef.current.position.set(
            currentPosition.current.x,
            currentPosition.current.y + 12.5,
            currentPosition.current.z
        );

        // onPositionChange([
        //     baseRef.current.position.x,
        //     baseRef.current.position.y,
        //     baseRef.current.position.z
        // ]);
    });

    // useImperativeHandle(ref, () => ({
    //     grab() {
    //         setTargetY(2); // 下降
    //         setTimeout(() => {
    //             setTargetY(12); // 上升
    //         }, 1000);
    //     }
    // }));

    return (
        <>
            {/* 爪子吊绳 - 总是从顶部垂下 */}
            <mesh ref={cableRef} castShadow>
                <cylinderGeometry args={[cableThickness, cableThickness, cableHeight, 12]} />
                <meshStandardMaterial color="#222222" />
            </mesh>

            {/* 爪子主体 */}
            <group ref={baseRef}>
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
};

export default forwardRef(Claw);
