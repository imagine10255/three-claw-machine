import {Physics, useBox, usePlane, useSphere} from '@react-three/cannon';
import {OrbitControls, Text} from '@react-three/drei';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import {Vector3} from 'three';
import {IApi, TTargetIndex} from './types';

// 型別定義
interface ClawProps {
    position: [number, number, number]
    isGrabbing: boolean
    onPositionChange: (position: [number, number, number]) => void
}

interface DollProps {
    position: [number, number, number]
    color: string
    size?: number
}

interface Props {
    data: IApi[]
    target: TTargetIndex
    times: number
}

// 地板
function Floor() {
    // @ts-ignore - 忽略类型检查，因为usePlane返回的ref实际上可以用于mesh
    const [ref] = usePlane(() => ({
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

// 娃娃機底座
function Base() {
    // @ts-ignore - 忽略类型检查，因为useBox返回的ref实际上可以用于mesh
    const [ref] = useBox(() => ({
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

// 娃娃機壁
function Walls() {
    const wallProps = [
        {position: [0, 7, 10] as [number, number, number], args: [20, 12, 0.5] as [number, number, number]}, // 后壁
        {position: [0, 7, -10] as [number, number, number], args: [20, 12, 0.5] as [number, number, number]}, // 前壁
        {position: [10, 7, 0] as [number, number, number], args: [0.5, 12, 20] as [number, number, number]}, // 右壁
        {position: [-10, 7, 0] as [number, number, number], args: [0.5, 12, 20] as [number, number, number]} // 左壁
    ]

    return (
        <>
            {wallProps.map((props, i) => (
                <Wall key={i} position={props.position} args={props.args} />
            ))}
        </>
    )
}

function Wall({position, args}: {position: [number, number, number], args: [number, number, number]}) {
    // @ts-ignore - 忽略类型检查，因为useBox返回的ref实际上可以用于mesh
    const [ref] = useBox(() => ({
        mass: 0,
        position,
        args,
        type: 'Static'
    }))

    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.2} />
        </mesh>
    )
}

// 爪子组件
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

// 娃娃组件
function Doll({position, color, size = 2}: DollProps) {
    // @ts-ignore - 忽略类型检查，因为useSphere返回的ref实际上可以用于mesh
    const [ref] = useSphere(() => ({
        mass: 1,
        position,
        args: [size / 2],
        type: 'Dynamic'
    }))

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[size / 2, 32, 32]} />
            <meshStandardMaterial 
                color={color} 
                metalness={0.1} 
                roughness={0.2} 
                emissive={color} 
                emissiveIntensity={0.2} 
            />
        </mesh>
    )
}

// 控制面板
function ControlPanel({onMove, onGrab, isGrabbing}: {onMove: (direction: string) => void, onGrab: () => void, isGrabbing: boolean}) {
    return (
        <div className="controls">
            <div className="d-pad">
                <button onClick={() => onMove('forward')}>前</button>
                <button onClick={() => onMove('backward')}>后</button>
                <button onClick={() => onMove('left')}>左</button>
                <button onClick={() => onMove('right')}>右</button>
            </div>
            <button className="grab-btn" onClick={onGrab}>
                {isGrabbing ? '松开' : '抓取'}
            </button>
        </div>
    )
}

// 游戏信息
function GameInfo({dolls, caught}: {dolls: number, caught: number}) {
    return (
        <div className="game-info">
            <p>剩余娃娃: {dolls}</p>
            <p>已抓取: {caught}</p>
        </div>
    )
}

// 主遊戲組件
const ClawMachine: React.FC<Props> = ({data}) => {
    const [clawPosition, setClawPosition] = useState<[number, number, number]>([0, 4, 0])
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false)
    const [caughtDolls, setCaughtDolls] = useState<number>(0)
    const moveSpeed = 1

    const dollColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    // 调整娃娃位置，让娃娃站在平台上
    const dollPositions: [number, number, number][] = [
        [5, 2, 5],
        [-5, 2, 5],
        [0, 2, 0],
        [5, 2, -5],
        [-5, 2, -5],
        [0, 2, -7],
        [7, 2, 0],
        [-7, 2, 0],
    ]

    // 修改键盘事件处理
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault(); // 防止默认行为
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    handleMove('forward');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    handleMove('backward');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    handleMove('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    handleMove('right');
                    break;
                case ' ':
                    handleGrab();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGrabbing]); // 只依赖isGrabbing状态

    const handleMove = (direction: string) => {
        console.log('xxx');
        setClawPosition(prevPosition => {
            let [x, y, z] = prevPosition;
            switch (direction) {
                case 'forward':
                    z = Math.max(-9, Math.min(9, z - moveSpeed));
                    break;
                case 'backward':
                    z = Math.max(-9, Math.min(9, z + moveSpeed));
                    break;
                case 'left':
                    x = Math.max(-9, Math.min(9, x - moveSpeed));
                    break;
                case 'right':
                    x = Math.max(-9, Math.min(9, x + moveSpeed));
                    break;
            }
            return [x, y, z];
        });
    };

    const handleGrab = () => {
        setIsGrabbing(!isGrabbing)
        if (isGrabbing) {
            // 抓取结束，爪子上升到最高位置
            setClawPosition([clawPosition[0], 30, clawPosition[2]])
            
            // 检查是否有娃娃在爪子下方，简单模拟
            const dollNearClaw = dollPositions.some(pos => {
                const dx = Math.abs(pos[0] - clawPosition[0])
                const dz = Math.abs(pos[2] - clawPosition[2])
                return dx < 2 && dz < 2
            })
            
            if (dollNearClaw && Math.random() > 0.5) {
                setCaughtDolls(prev => prev + 1)
            }
        } else {
            // 开始抓取，爪子下降到娃娃高度上方一点
            setClawPosition([clawPosition[0], 3, clawPosition[2]])
        }
    }

    const handleClawPositionChange = (newPosition: [number, number, number]) => {
        // 更新爪子位置，但限制在娃娃机范围内
        const x = Math.max(-9, Math.min(9, newPosition[0]))
        const y = Math.max(3, Math.min(30, newPosition[1])) // 调整高度上限到30
        const z = Math.max(-9, Math.min(9, newPosition[2]))
        setClawPosition([x, y, z])
    }

    // 增加键盘控制说明
    const renderKeyboardControls = () => (
        <div className="keyboard-controls">
            <p>键盘控制: 方向键/WASD移动, 空格键抓取</p>
        </div>
    )

    return (
        <GameContainer>
            <Canvas shadows camera={{position: [20, 20, 20], fov: 50}}>
                <color attach="background" args={['#87CEEB']} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 15, 10]} intensity={1.2} castShadow />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <OrbitControls makeDefault />
                
                <Physics>
                    {/*<Floor />*/}
                    <Base />
                    <Walls />
                    <Claw
                        position={clawPosition}
                        isGrabbing={isGrabbing}
                        onPositionChange={handleClawPositionChange}
                    />
                    
                    {dollPositions.map((position, index) => (
                        <Doll
                            key={index}
                            position={position}
                            color={dollColors[index % dollColors.length]}
                            size={3}
                        />
                    ))}
                </Physics>
                
                <gridHelper args={[30, 30]} position={[0, -1.9, 0]} />
            </Canvas>
            
            <UIContainer>
                <ControlPanel 
                    onMove={handleMove} 
                    onGrab={handleGrab} 
                    isGrabbing={isGrabbing}
                />
                <GameInfo 
                    dolls={dollPositions.length} 
                    caught={caughtDolls}
                />
                {renderKeyboardControls()}
            </UIContainer>
        </GameContainer>
    )
}

export default ClawMachine





const GameContainer = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
`

const UIContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    pointer-events: none;
    
    .controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        pointer-events: auto;
        
        .d-pad {
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            grid-template-areas:
                ". up ."
                "left . right"
                ". down .";
            margin-bottom: 10px;
            
            button {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                background: #333;
                color: white;
                border: none;
                font-size: 18px;
                cursor: pointer;
                
                &:hover {
                    background: #555;
                }
                
                &:nth-child(1) {
                    grid-area: up;
                }
                &:nth-child(2) {
                    grid-area: down;
                }
                &:nth-child(3) {
                    grid-area: left;
                }
                &:nth-child(4) {
                    grid-area: right;
                }
            }
        }
        
        .grab-btn {
            width: 120px;
            height: 60px;
            border-radius: 30px;
            background: #ff4d4d;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            
            &:hover {
                background: #ff6666;
            }
        }
    }
    
    .game-info {
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 18px;
        pointer-events: auto;
        margin-bottom: 10px;
        
        p {
            margin: 5px 0;
        }
    }
    
    .keyboard-controls {
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 16px;
        pointer-events: auto;
        
        p {
            margin: 5px 0;
        }
    }
`

