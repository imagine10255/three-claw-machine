import {Physics} from '@react-three/cannon';
import {Canvas} from '@react-three/fiber';
import {Suspense} from 'react';

import Ball from './_components/Ball';
import ContactGround from './_components/ContactGround';
import Paddle from './_components/Paddle';
import {useStore} from './common';




/**
 * Pingpong
 */
const Pingpong = () => {
    const welcome = useStore((state) => state.welcome);
    const {reset} = useStore((state) => state.api);

    return (
        <>
            <Canvas
                camera={{fov: 50, position: [0, 5, 12]}}
                onPointerMissed={() => welcome && reset(false)}
                shadows
            >
                <color attach="background" args={['#171720']} />
                <ambientLight intensity={0.5 * Math.PI} />
                <pointLight decay={0} intensity={Math.PI} position={[-10, -10, -10]} />
                <spotLight
                    angle={0.3}
                    castShadow
                    decay={0}
                    intensity={Math.PI}
                    penumbra={1}
                    position={[10, 10, 10]}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-bias={-0.0001}
                />
                <Physics
                    iterations={20}
                    tolerance={0.0001}
                    defaultContactMaterial={{
                        contactEquationRelaxation: 1,
                        contactEquationStiffness: 1e7,
                        friction: 0.9,
                        frictionEquationRelaxation: 2,
                        frictionEquationStiffness: 1e7,
                        restitution: 0.7,
                    }}
                    gravity={[0, -40, 0]}
                    allowSleep={false}
                >
                    <mesh position={[0, 0, -10]} receiveShadow>
                        <planeGeometry args={[1000, 1000]} />
                        <meshPhongMaterial color="#172017" />
                    </mesh>
                    <ContactGround />
                    {!welcome && <Ball />}
                    <Suspense fallback={null}>
                        <Paddle />
                    </Suspense>
                </Physics>
            </Canvas>
            <div style={style(welcome)}>* click anywhere to start</div>
        </>
    );
};

export default Pingpong;





const style = (welcome: boolean) =>
    ({
        color: 'white',
        display: welcome ? 'block' : 'none',
        fontSize: '1.2em',
        left: 50,
        position: 'absolute',
        top: 50,
    } as const);
