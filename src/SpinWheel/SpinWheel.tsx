import {Physics, useBox, usePlane, useSphere} from '@react-three/cannon';
import {OrbitControls} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Vector3} from 'three';

// 型別定義
interface ClawProps {
    position?: Vector3
    isGrabbing: boolean
}

interface DollProps {
    position: [number, number, number]
}

// 基础平面
function Plane() {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -2, 0]
    }))
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#666666" />
        </mesh>
    )
}

// 大型平台
function Platform() {
    const [ref] = useBox(() => ({
        mass: 0,
        position: [0, 0, 0],
        args: [20, 1, 20]
    }))
    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={[20, 1, 20]} />
            <meshStandardMaterial color="#8B4513" />
        </mesh>
    )
}

// 测试立方体
function TestCube() {
    return (
        <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="red" />
        </mesh>
    )
}

// 娃娃组件
function Doll({ position }: DollProps) {
    return (
        <mesh position={position} castShadow>
            <sphereGeometry args={[3, 32, 32]} />
            <meshStandardMaterial color="red" metalness={0.1} roughness={0.2} emissive="red" emissiveIntensity={0.2} />
        </mesh>
    );
}

// 主遊戲組件
const Game: React.FC = () => {
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

    const dollPositions: [number, number, number][] = [
        [7, 4, 7],
        [-7, 4, 7],
        [0, 4, 0],
        [7, 4, -7],
        [-7, 4, -7],
    ];

    return (
        <GameContainer>
            <Canvas shadows camera={{ position: [20, 20, 20], fov: 50 }}>
                <color attach="background" args={['#87CEEB']} />

                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />

                <OrbitControls makeDefault />

                <Physics>
                    <Plane />
                    <Platform />
                    {dollPositions.map((position, index) => (
                        <Doll key={index} position={position} />
                    ))}
                </Physics>

                <gridHelper args={[30, 30]} position={[0, -1.9, 0]} />
                <axesHelper args={[10]} />
            </Canvas>
        </GameContainer>
    );
};

export default Game;

const GameContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background: #000;
`;

