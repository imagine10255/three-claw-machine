// 爪子组件
import {useBox} from '@react-three/cannon';
import {MeshProps, useFrame} from '@react-three/fiber';
import {ForwardedRef, forwardRef, useEffect,useImperativeHandle, useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

// 型別定義
interface ClawProps {
    position: [number, number, number]
    isGrabbing: boolean
}

interface ArmProps {
    position: [number, number, number]
    args: [number, number, number]
    rotation: [number, number, number]
}

export interface IClawRefProps{
    startMoving: (direction: string) => void
    stopMoving: () => void
}


/**
 * 爪子
 * @param position
 * @param isGrabbing
 * @param ref
 * @constructor
 */
const Claw = ({
    position,
    isGrabbing,
}: ClawProps, ref: ForwardedRef<IClawRefProps>) => {
    const baseRef = useRef<THREE.Group>(null);
    const cableRef = useRef<THREE.Mesh>(null);
    const [targetY, setTargetY] = useState(position[1]);

    const keysPressed = useRef<Set<string>>(new Set());
    const currentDirection = useRef<string | null>(null);
    const isGraspRef = useRef<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const [baseBody, baseApi] = useBox(() => ({
        mass: 1,
        position,
        args: [3, 0.8, 3],
        type: 'Dynamic',
        allowSleep: false,
        // onCollide: (e) => {
        //     console.log('Claw collided', e);
        // }
    }));

    const baseY = 10;
    const base2Y = 8;

    // 爪子线缆 - 调整高度
    const cableHeight = 25; // 固定高度，确保线缆总是从机器顶部垂下
    const cableThickness = 0.2;

    // 爪子手臂 - 更加复杂的结构
    const armProps: ArmProps[] = isGrabbing ? [
        // 爪子内侧位置 (抓取状态)
        {position: [0.8, base2Y, 0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, 0.3]},
        {position: [-0.8, base2Y, 0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, -0.3]},
        {position: [0.8, base2Y, -0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, 0.3]},
        {position: [-0.8, base2Y, -0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, -0.3]},

        // 爪子尖端 (抓取状态)
        {position: [1, base2Y, 1], args: [0.3, 0.8, 0.3], rotation: [0, 0, 0.5]},
        {position: [-1, base2Y, 1], args: [0.3, 0.8, 0.3], rotation: [0, 0, -0.5]},
        {position: [1, base2Y, -1], args: [0.3, 0.8, 0.3], rotation: [0, 0, 0.5]},
        {position: [-1, base2Y, -1], args: [0.3, 0.8, 0.3], rotation: [0, 0, -0.5]},
    ] : [
        // 爪子外侧位置 (非抓取状态)
        {position: [0.8, base2Y, 0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, -0.3]},
        {position: [-0.8, base2Y, 0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, 0.3]},
        {position: [0.8, base2Y, -0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, -0.3]},
        {position: [-0.8, base2Y, -0.8], args: [0.4, 2.5, 0.4], rotation: [0, 0, 0.3]},

        // 爪子尖端 (非抓取状态)
        {position: [1, base2Y, 1], args: [0.3, 0.8, 0.3], rotation: [0, 0, -0.5]},
        {position: [-1, base2Y, 1], args: [0.3, 0.8, 0.3], rotation: [0, 0, 0.5]},
        {position: [1, base2Y, -1], args: [0.3, 0.8, 0.3], rotation: [0, 0, -0.5]},
        {position: [-1, base2Y, -1], args: [0.3, 0.8, 0.3], rotation: [0, 0, 0.5]},
    ];

    // 爪子连接部分
    const connectorProps: { position: [number, number, number], args: [number, number, number] }[] = [
        {position: [0, baseY, 0], args: [0.5, 0.5, 0.5]},
        {position: [0, base2Y, 0], args: [0.5, 0.5, 0.5]},
    ];


    useFrame((state, delta) => {
        onMove(delta);


        const move = new Vector3();

        if (baseRef.current) {
            move.y = -1;

            move.normalize();
            const baseSpeed = 7;
            // if (!move.equals(new Vector3(0, 0, 0))) {
            if(isGraspRef.current === 1) {
                baseRef.current.position.y += move.y * baseSpeed * delta; // 更新 x 轴位置
                if (baseRef.current.position.y < -5) {
                    isGraspRef.current = 2;
                }
            }
            else if(isGraspRef.current === 2){
                baseRef.current.position.y -= move.y * baseSpeed * delta; // 更新 x 轴位置
                if (baseRef.current.position.y >= 0) {
                    isGraspRef.current = 0;
                }
            }

        }
    });

    useImperativeHandle(ref, () => ({
        startMoving,
        stopMoving,
    }));

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {

            const direction = getDirectionFromKey(e.code);
            if(['up','down','left','right'].includes(direction)){
                startMoving(direction);
                e.preventDefault();

            }else if(direction === 'grasp'){
                isGraspRef.current = 1;
                e.preventDefault();

            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            stopMoving();
        };


        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            stopMoving();
        };

    }, []);

    const startMoving = (direction: string) => {
        if (!direction) return;
        currentDirection.current = direction;
    };

    const stopMoving = () => {
        currentDirection.current = null;
    };


    const onMove = (delta: number) => {
        const move = new Vector3();

        const direction = currentDirection.current;
        if (direction && baseRef.current) {
            if (direction === 'left') {
                move.x = -1; // 向左移动
            } else if (direction === 'right') {
                move.x = 1; // 向右移动
            }else if (direction === 'up') {
                move.z = -1; // 向前移动
            } else if (direction === 'down') {
                move.z = 1; // 向後移动
            }
            move.normalize();
            const baseSpeed = 20;
            if (!move.equals(new Vector3(0, 0, 0))) {
                baseRef.current.position.x += move.x * baseSpeed * delta; // 更新 x 轴位置
                baseRef.current.position.z += move.z * baseSpeed * delta; // 更新 z 轴位置
            } else {
                // 停止移动时不需要更新位置
            }

        }

    };


    const getDirectionFromKey = (key: string): string => {
        switch (key) {
        case 'ArrowUp':
            return 'up';
        case 'ArrowDown':
            return 'down';
        case 'ArrowLeft':
            return 'left';
        case 'ArrowRight':
            return 'right';
        case 'Space':
            return 'grasp';
        default:
            return '';
        }
    };


    return (
        <>
            {/* 爪子吊绳 - 总是从顶部垂下 */}
            <mesh ref={cableRef} castShadow>
                <cylinderGeometry args={[cableThickness, cableThickness, cableHeight, 12]}/>
                <meshStandardMaterial color="#666666"/>
            </mesh>

            {/* 爪子主体 */}
            <group
                // ref={setForwardedRef(ref, baseRef)}
                ref={baseRef}
            >
                {/* 爪子基座 */}
                <primitive object={baseBody}/>
                <mesh position={[0, baseY, 0]} castShadow>
                    <boxGeometry args={[2.8, 0.5, 2.8]}/>
                    <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2}/>
                </mesh>

                {/* 爪子连接部分 */}
                {connectorProps.map((props, i) => (
                    <mesh key={`connector-${i}`} position={props.position} castShadow>
                        <cylinderGeometry args={[...props.args]}/>
                        <meshStandardMaterial color="#777777" metalness={0.6} roughness={0.3}/>
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
                        <boxGeometry args={props.args}/>
                        <meshStandardMaterial color="#999999" metalness={0.5} roughness={0.4}/>
                    </mesh>
                ))}
            </group>
        </>
    );
};

export default forwardRef(Claw);
