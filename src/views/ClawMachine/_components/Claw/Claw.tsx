// 爪子组件
import {useBox} from '@react-three/cannon';
import {useFrame} from '@react-three/fiber';
import {ForwardedRef, forwardRef, useEffect,useImperativeHandle, useRef} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

import Arm from './Arm';
import {IArmProps} from './types';



export interface IClawRefProps{
    startMoving: (direction: EDirectionState) => void
    stopMoving: () => void
}


enum EGrabState {
    idle = 'idle',
    down = 'down',
    up = 'up',
}
export enum EDirectionState {
    down = 'down',
    up = 'up',
    left = 'left',
    right = 'right',
}

const initY = 12;


/**
 * 爪子
 * @param ref
 */
const Claw = (
    {}, ref: ForwardedRef<IClawRefProps>) => {
    const currentDirection = useRef<string | null>(null);
    const grabStateRef = useRef<EGrabState>(EGrabState.idle);
    const isGrabbingRef = useRef(false); // 新增

    const clawYRef = useRef(initY);

    useEffect(() => {
        const unsubscribe = clawApi.position.subscribe(([x, y]) => {
            clawYRef.current = y;
        });
        return unsubscribe;
    }, []);


    const [clawRef, clawApi] = useBox(() => ({
        mass: 0,
        args: [1, 1, 1],
        position: [
            1,
            initY,
            2
        ],
        type: 'Dynamic',
        userData: {
            tag: 'Claw'
        },
        allowSleep: false,
        // collisionResponse: true,
        onCollide: (e) => {
            // console.log('Claw collided', e.target);
            const tag = (e.body as any).userData?.tag;
            if (tag === 'Box' || tag === 'Plane' && grabStateRef.current === EGrabState.down) { // 修改
                grabStateRef.current = EGrabState.up;
                isGrabbingRef.current = true; // 修改
            }

        }
    }),
    useRef<THREE.Group>(null),
    );


    const baseY = 10;
    const base2Y = -1;
    const arg1Height = 1.5;
    const arg2Height = 2;
    const arm1 = {
        y: arg1Height / -2,
        args: [.4, arg1Height, .2] as IArmProps['args'],
    };
    const arm2 = {
        y: (arg1Height * -1) + (arg2Height / -2) * .6,
        args: [.4, arg2Height, .2] as IArmProps['args'],
    };

    // 爪子线缆 - 调整高度
    const cableHeight = 25; // 固定高度，确保线缆总是从机器顶部垂下
    const cableThickness = 0.2;

    // 爪子手臂 - 更加复杂的结构
    const armProps: IArmProps[] = grabStateRef.current === EGrabState.down ? [
        // 爪子内侧位置 (抓取状态)
        {position: [0.8, arm1.y, 0.8], args: arm1.args, rotation: [0, 0, 0.3]},
        {position: [-0.8, arm1.y, 0.8], args: arm1.args, rotation: [0, 0, -0.3]},
        {position: [0.8, arm1.y, -0.8], args: arm1.args, rotation: [0, 0, 0.3]},
        {position: [-0.8, arm1.y, -0.8], args: arm1.args, rotation: [0, 0, -0.3]},

        // 爪子尖端 (抓取状态)
        {position: [1, arm2.y, 1], args: arm2.args, rotation: [0, 0, 0.5]},
        {position: [-1, arm2.y, 1], args: arm2.args, rotation: [0, 0, -0.5]},
        {position: [1, arm2.y, -1], args: arm2.args, rotation: [0, 0, 0.5]},
        {position: [-1, arm2.y, -1], args: arm2.args, rotation: [0, 0, -0.5]},
    ] : [
        // 爪子外侧位置 (非抓取状态)
        {position: [1, arm1.y, 1], args: arm1.args, rotation: [-.3, .3, 0.3]},
        {position: [-1, arm1.y, 1], args: arm1.args, rotation: [-.3, .3, -0.3]},
        {position: [1, arm1.y, -1], args: arm1.args, rotation: [.3, .3, 0.3]},
        {position: [-1, arm1.y, -1], args: arm1.args, rotation: [.3, .3, -0.3]},

        // 爪子尖端 (非抓取状态)
        {position: [1, arm2.y, 1], args: arm2.args, rotation: [.3, .3, -0.3]},
        {position: [-1, arm2.y, 1], args: arm2.args, rotation: [.3, .3, 0.3]},
        {position: [1, arm2.y, -1], args: arm2.args, rotation: [-.3, .3, -0.3]},
        {position: [-1, arm2.y, -1], args: arm2.args, rotation: [-.3, .3, 0.3]},
    ];

    // 爪子连接部分
    const connectorProps: { position: [number, number, number], args: [number, number, number] }[] = [
        {position: [0, baseY, 0], args: [0.5, 0.5, 0.5]},
        {position: [0, base2Y, 0], args: [0.5, 0.5, 0.5]},
    ];


    useFrame((state, delta) => {
        onMove(delta);
        onGrab(delta);
    });

    useImperativeHandle(ref, () => ({
        startMoving,
        stopMoving,
    }));

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {

            const direction = getDirectionFromKey(e.code);
            if(direction && [EDirectionState.up, EDirectionState.down, EDirectionState.left, EDirectionState.right].includes(direction)){
                e.preventDefault();
                startMoving(direction);

            }else if(e.code === 'Space'){
                e.preventDefault();
                grabStateRef.current = EGrabState.down;
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

    const startMoving = (direction: EDirectionState) => {
        if (!direction) return;
        currentDirection.current = direction;
    };

    const stopMoving = () => {
        currentDirection.current = null;
    };


    /**
     * 抓取
     * @param delta
     */
    const onGrab = (delta: number) => {
        if(grabStateRef.current === EGrabState.idle) return;
        if(!clawRef.current) return;

        const baseSpeed = 7;
        const currentY = clawYRef.current;

        if (grabStateRef.current === EGrabState.down) {
            clawApi.velocity.set(0, -baseSpeed, 0);

        } else if (grabStateRef.current === EGrabState.up) {
            clawApi.velocity.set(0, baseSpeed, 0);

            if (currentY >= initY) {
                grabStateRef.current = EGrabState.idle;
                //     isGrabbingRef.current = false; // 修改
                // clawApi.velocity.set(0, 0, 0);
            }
        }
    };


    /**
     * 移動爪子
     * @param delta
     */
    const onMove = (delta: number) => {
        if(grabStateRef.current === EGrabState.down) return;
        if(!clawRef.current) return;


        const move = new Vector3();

        const direction = currentDirection.current;
        if (direction) {
            if (direction === EDirectionState.left) {
                move.x = -1;
            } else if (direction === EDirectionState.right) {
                move.x = 1;
            } else if (direction === EDirectionState.up) {
                move.z = -1;
            } else if (direction === EDirectionState.down) {
                move.z = 1;
            }

            move.normalize();
            const baseSpeed = 5;

            if (!move.equals(new Vector3(0, 0, 0))) {
                const velocityX = move.x * baseSpeed;
                const velocityZ = move.z * baseSpeed;
                clawApi.velocity.set(velocityX, 0, velocityZ);
            } else {
                clawApi.velocity.set(0, 0, 0);
            }
        } else {
            clawApi.velocity.set(0, 0, 0);
        }
    };


    const getDirectionFromKey = (key: string): EDirectionState|null => {
        switch (key) {
        case 'ArrowUp':
            return EDirectionState.up;
        case 'ArrowDown':
            return EDirectionState.down;
        case 'ArrowLeft':
            return EDirectionState.left;
        case 'ArrowRight':
            return EDirectionState.right;
        default:
            return null;
        }
    };


    return (
        <>
            {/* 爪子吊绳 - 总是从顶部垂下 */}
            {/*<mesh ref={cableRef} castShadow>*/}
            {/*    <cylinderGeometry args={[cableThickness, cableThickness, cableHeight, 12]}/>*/}
            {/*    <meshStandardMaterial color="#666666"/>*/}
            {/*</mesh>*/}

            {/* 爪子主体 */}
            <group
                // ref={setForwardedRef(ref, baseRef)}
                ref={clawRef}
                // args={[undefined, undefined, number]}
                receiveShadow
                castShadow
            >
                {/* 爪子基座 */}
                {/*<primitive object={baseBody}/>*/}
                <mesh
                    // position={[0, baseY, 0]} castShadow
                >
                    <boxGeometry args={[2.8, 0.5, 2.8]}/>
                    <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2}/>
                </mesh>

                {/* 爪子连接部分 */}
                {/*{connectorProps.map((props, i) => (*/}
                {/*    <mesh key={`connector-${i}`} position={props.position} castShadow>*/}
                {/*        <cylinderGeometry args={[...props.args]}/>*/}
                {/*        <meshStandardMaterial color="#777777" metalness={0.6} roughness={0.3}/>*/}
                {/*    </mesh>*/}
                {/*))}*/}

                {/* 爪子手臂 */}
                {armProps.map((props, i) => {
                    return <Arm
                        key={`arm-${i}`}
                        position={props.position}
                        args={props.args}
                        rotation={props.rotation}
                    />;
                })}

                {/*{armProps.map((props, i) => {*/}
                {/*    return <mesh*/}
                {/*        key={`arm-${i}`}*/}
                {/*        position={props.position}*/}
                {/*        // rotation={props.rotation}*/}
                {/*        castShadow*/}
                {/*    >*/}
                {/*        <boxGeometry args={props.args}/>*/}
                {/*        <meshStandardMaterial color="#999999" metalness={0.5} roughness={0.4}/>*/}
                {/*    </mesh>;*/}
                {/*})}*/}
            </group>
        </>
    );
};

export default forwardRef(Claw);
