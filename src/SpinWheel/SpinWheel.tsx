import {Physics, useBox, usePlane, useSphere} from '@react-three/cannon';
import {OrbitControls} from '@react-three/drei';
import {Canvas, MeshProps, ThreeElements} from '@react-three/fiber';
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

type ClawPosition = [number, number, number];
function Plane(props: any) {
    const [ref] = usePlane<any>(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref}>
            <planeGeometry args={[100, 100]} />
        </mesh>
    )
}

function Cube(props: any) {
    const [ref] = useBox<any>(() => ({ mass: 1, position: [0, 5, 0], ...props }))
    return (
        <mesh ref={ref}>
            <boxGeometry />
        </mesh>
    )
}

// 主遊戲組件
const Game: React.FC = () => {
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

    // 生成隨機娃娃位置
    const dollPositions: [number, number, number][] = [
        [1, 0, 0],
        [-1, 0, 1],
        [0, 0, -1],
        [2, 0, 1],
        [-2, 0, -1],
    ];

    return (
        <GameContainer>
            <Canvas camera={{ position: [0, 5, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                <Physics>
                    <Plane />
                    <Cube />
                </Physics>
            </Canvas>
        </GameContainer>
    );
};

export default Game;



// 遊戲場景容器樣式
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000;
`;

