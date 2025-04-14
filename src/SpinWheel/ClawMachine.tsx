import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IApi, TTargetIndex } from './types';
import Doll from "./Doll.tsx";
import Claw from "./Claw.tsx";
import Walls from "./Wall.tsx";
import Base from "./Base.tsx";
import GameInfo from "./GameInfo.tsx";
import ControlPanel from "./ControlPanel.tsx";

interface Props {
    data: IApi[]
    target: TTargetIndex
    times: number
}

// 主遊戲組件
const ClawMachine: React.FC<Props> = ({ data }) => {
    const [clawPosition, setClawPosition] = useState<[number, number, number]>([0, 0, 0])
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false)
    const [caughtDolls, setCaughtDolls] = useState<number>(0)
    const moveSpeed = 1
    const clawRef = useRef<any>(null);

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
            switch (e.key) {
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
        console.log('direction', direction);
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
        if (clawRef.current) {
            clawRef.current.grab();
        }
    };

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
            <Canvas shadows camera={{ position: [20, 20, 20], fov: 50 }}>
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
                        ref={clawRef}
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
