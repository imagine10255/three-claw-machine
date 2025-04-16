import {Physics} from '@react-three/cannon';
import {OrbitControls} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {Color} from 'three';

import Boxes from '@/views/ClawMachine/_components/Boxes/Boxes';

import Claw, {IClawRefProps} from './_components/Claw';
import ControlPanel from './_components/ControlPanel';
import GameInfo from './_components/GameInfo';
import Planes from './_components/Planes';
import VirtualJoystick from './_components/VirtualJoystick';
import Walls from './_components/Wallets/Walls';
import {IApi, TTargetIndex} from './types';
const niceColors = ['#99b898', '#fecea8', '#ff847c', '#e84a5f', '#2a363b'];

interface Props {
    data: IApi[]
    target: TTargetIndex
    times: number
}

const boxNumber: number = 101;
const boxSize: number = 1.5;

// 主遊戲組件
const ClawMachine = () => {

    const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
    const [caughtDolls, setCaughtDolls] = useState<number>(0);
    const baseSpeed = 0.2;
    // const clawRef = useRef<Group>(null);
    const clawRef = useRef<IClawRefProps>(null);
    const keysPressed = useRef<Set<string>>(new Set());
    const currentDirection = useRef<string | null>(null);
    const currentForce = useRef<number>(1);
    const lerpFactor = 0.1;
    const animationFrameRef = useRef<number | null>(null);

    const dollColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const dollPositions: [number, number, number][] = [
        [5, 2, 5],
        [-5, 2, 5],
        [0, 2, 0],
        [5, 2, -5],
        [-5, 2, -5],
        [0, 2, -7],
        [7, 2, 0],
        [-7, 2, 0],
    ];



    const colors = useMemo(() => {
        const array = new Float32Array(boxNumber * 3);
        const color = new Color();
        for (let i = 0; i < boxNumber; i++)
            color
                .set(niceColors[Math.floor(Math.random() * 5)])
                .convertSRGBToLinear()
                .toArray(array, i * 3);
        return array;
    }, [boxNumber]);

    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         e.preventDefault();
    //         if (!keysPressed.current.has(e.key)) {
    //             keysPressed.current.add(e.key);
    //             startMoving(getDirectionFromKey(e.key), 1);
    //         }
    //     };
    //
    //     const handleKeyUp = (e: KeyboardEvent) => {
    //         keysPressed.current.delete(e.key);
    //         if (keysPressed.current.size === 0) {
    //             stopMoving();
    //         } else {
    //             const lastKey = Array.from(keysPressed.current).pop();
    //             if (lastKey) {
    //                 startMoving(getDirectionFromKey(lastKey), 1);
    //             }
    //         }
    //     };
    //
    //     const getDirectionFromKey = (key: string): string => {
    //         switch (key) {
    //             case 'ArrowUp':
    //             case 'w':
    //             case 'W':
    //                 return 'forward';
    //             case 'ArrowDown':
    //             case 's':
    //             case 'S':
    //                 return 'backward';
    //             case 'ArrowLeft':
    //             case 'a':
    //             case 'A':
    //                 return 'left';
    //             case 'ArrowRight':
    //             case 'd':
    //             case 'D':
    //                 return 'right';
    //             default:
    //                 return '';
    //         }
    //     };
    //
    //     const animate = () => {
    //         if (currentDirection.current && clawRef.current) {
    //             const speed = baseSpeed * currentForce.current;
    //             const position = clawRef.current.position;
    //             let newX = position.x;
    //             let newZ = position.z;
    //
    //             switch (currentDirection.current) {
    //                 case 'forward':
    //                     newZ = Math.max(-9, Math.min(9, position.z - speed));
    //                     break;
    //                 case 'backward':
    //                     newZ = Math.max(-9, Math.min(9, position.z + speed));
    //                     break;
    //                 case 'left':
    //                     newX = Math.max(-9, Math.min(9, position.x - speed));
    //                     break;
    //                 case 'right':
    //                     newX = Math.max(-9, Math.min(9, position.x + speed));
    //                     break;
    //             }
    //
    //             // 使用 lerp 進行平滑移動
    //             position.x += (newX - position.x) * lerpFactor;
    //             position.z += (newZ - position.z) * lerpFactor;
    //         }
    //         animationFrameRef.current = requestAnimationFrame(animate);
    //     };
    //
    //     animationFrameRef.current = requestAnimationFrame(animate);
    //
    //     window.addEventListener('keydown', handleKeyDown);
    //     window.addEventListener('keyup', handleKeyUp);
    //
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //         window.removeEventListener('keyup', handleKeyUp);
    //         if (animationFrameRef.current) {
    //             cancelAnimationFrame(animationFrameRef.current);
    //         }
    //         stopMoving();
    //     };
    // }, []);

    const startMoving = (direction: string, force: number = 1) => {
        if (!direction) return;
        currentDirection.current = direction;
        currentForce.current = force;
    };

    const stopMoving = () => {
        currentDirection.current = null;
        currentForce.current = 1;
    };

    const handleGrab = () => {
        if (clawRef.current) {
            // clawRef.current.grab();
        }
    };

    // 增加键盘控制说明
    const renderKeyboardControls = () => (
        <div className="keyboard-controls">
            <p>键盘控制: 方向键/WASD移动, 空格键抓取</p>
        </div>
    );

    return (
        <GameContainer>
            <Canvas
                camera={{
                    fov: 50,
                    position: [-14, 24, 34]
                }}
                shadows
                gl={{
                    localClippingEnabled: true
                }}
            >
                <color attach="background" args={['lightblue']} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 15, 10]} intensity={1.2} castShadow />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <OrbitControls
                    makeDefault
                    // onChange={(e) => {
                    //     const cam = e?.target.object;
                    //     console.log('Camera moved to:', cam?.position.toArray());
                    // }}
                />



                <Physics>
                    <Planes />
                    <Walls />
                    <Claw
                        ref={clawRef}
                    />

                    <Boxes {...{colors, number: boxNumber, size: boxSize}} />
                </Physics>

                <gridHelper
                    args={[30, 30]}
                    position={[0, -0.1, 0]}
                />
            </Canvas>

            <UIContainer>
                <ControlPanel
                    onMove={startMoving}
                    onGrab={handleGrab}
                    isGrabbing={isGrabbing}
                />
                <GameInfo
                    dolls={dollPositions.length}
                    caught={caughtDolls}
                />
                {renderKeyboardControls()}
            </UIContainer>

            <JoystickContainer>
                <VirtualJoystick
                    onMove={(direction) => {
                        // startMoving(direction);
                        if(clawRef.current){

                            clawRef.current.startMoving(direction);
                            // const speed = .5; // 定义移动速度
                            // const directionVector = new Vector3(direction.x, direction.y, direction.z).normalize().multiplyScalar(speed); // 归一化方向向量并乘以速度
                            // clawRef.current.position.add(directionVector); // 更新爪子的位置信息

                            // clawRef.current.copy(new Vector3(direction.x, direction.y, direction.z));
                        }
                    }}
                    onMoveEnd={() => {
                        if(clawRef.current){

                            clawRef.current.stopMoving();
                            // const speed = .5; // 定义移动速度
                            // const directionVector = new Vector3(direction.x, direction.y, direction.z).normalize().multiplyScalar(speed); // 归一化方向向量并乘以速度
                            // clawRef.current.position.add(directionVector); // 更新爪子的位置信息

                            // clawRef.current.copy(new Vector3(direction.x, direction.y, direction.z));
                        }
                        // stopMoving();
                    }}
                />
            </JoystickContainer>
        </GameContainer>
    );
};

export default ClawMachine;







const GameContainer = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
`;

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
`;

const JoystickContainer = styled.div`
    position: fixed;
    bottom: 100px;
    right: 100px;
    z-index: 1000;
    pointer-events: auto;
`;
