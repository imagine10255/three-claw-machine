// 爪子组件
import {useFrame} from '@react-three/fiber';
import {RapierRigidBody,RigidBody} from '@react-three/rapier';
import React, {ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

import Arm from './Arm';
import Cable from './Cable';
import {EDirectionState, EGrabState, IArmProps, IClawRefProps} from './types';

const initY = 11;
const maxCableLength = 20; // 最大绳子长度

/**
 * 爪子
 * @param ref
 */
const Claw = ({

              }, ref: ForwardedRef<IClawRefProps>) => {

    const currentDirection = useRef<string | null>(null);
    const grabStateRef = useRef<EGrabState>(EGrabState.idle);
    const isGrabbingRef = useRef(false); // 新增
    const [cableLength, setCableLength] = useState(0);
    const clawPosition = useRef<[number, number, number]>([1, initY, 2]);

    const clawYRef = useRef(initY);
    const clawRef = useRef<RapierRigidBody>(null);

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

        // clawYRef.current = clawRef.current?.translation().y;
    });

    useImperativeHandle(ref, () => ({
        startMoving,
        stopMoving,
    }));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const direction = getDirectionFromKey(e.code);
            if (direction && [EDirectionState.up, EDirectionState.down, EDirectionState.left, EDirectionState.right].includes(direction)) {
                e.preventDefault();
                startMoving(direction);
            } else if (e.code === 'Space') {
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
        if (grabStateRef.current === EGrabState.idle) return;
        if (!clawRef.current) return;

        const baseSpeed = 7;

        if (grabStateRef.current === EGrabState.down) {
            // 放绳子
            setCableLength(prev => {
                const newLength = prev + baseSpeed * delta;
                return Math.min(newLength, maxCableLength);
            });
            clawRef.current?.setLinvel({x: 0, y: 0, z: 0}, true);

        } else if (grabStateRef.current === EGrabState.up) {
            // 收绳子
            setCableLength(prev => {
                const newLength = prev - baseSpeed * delta;
                if (newLength <= 0) {
                    grabStateRef.current = EGrabState.idle;
                    return 0;
                }
                return newLength;
            });
            clawRef.current?.setLinvel({x: 0, y: 0, z: 0}, true);
        }
    };

    /**
     * 移動爪子
     * @param delta
     */
    const onMove = (delta: number) => {
        if (grabStateRef.current === EGrabState.down) return;
        console.log('clawRef', clawRef);

        if (!clawRef.current) return;

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
                clawRef.current?.setLinvel({x: velocityX, y: 0, z: velocityZ}, true);
            } else {
                clawRef.current?.setLinvel({x: 0, y: 0, z: 0}, true);
            }
        } else {
            clawRef.current?.setLinvel({x: 0, y: 0, z: 0}, true);
        }
    };

    const getDirectionFromKey = (key: string): EDirectionState | null => {
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
            {/* 固定在天花板上的绳子 */}
            <Cable
                length={cableLength}
                position={[clawPosition.current[0], initY - cableLength/2, clawPosition.current[2]]}
            />

            {/* 爪子主体 */}
            <RigidBody
                ref={clawRef}
                type="dynamic"
                position={[clawPosition.current[0], initY - cableLength, clawPosition.current[2]]}
                colliders="cuboid"
                canSleep={false}
                userData={{tag: 'Claw'}}
                lockRotations={true} // 锁定旋转
                lockTranslations={true} // 锁定所有方向的移动
            >
                {/* 爪子基座 */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[2.8, 0.5, 2.8]}/>
                    <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2}/>
                </mesh>

                {/* 爪子手臂 */}
                {armProps.map((props, i) => {
                    return <Arm
                        key={`arm-${i}`}
                        position={props.position}
                        args={props.args}
                        rotation={props.rotation}
                    />;
                })}
            </RigidBody>
        </>
    );
};

export default React.forwardRef(Claw);
