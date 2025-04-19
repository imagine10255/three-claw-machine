// 爪子组件
import {useFrame} from '@react-three/fiber';
import {RapierRigidBody,RigidBody, useFixedJoint} from '@react-three/rapier';
import React, {ForwardedRef, forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

import Arm from './Arm';
import Cable from './Cable';
import {EDirectionState, EGrabState, IArmProps, IClawRefProps} from './types';

const initY = 11;
const maxCableLength = 20; // 最大绳子长度


interface IProps {
    ref?: ForwardedRef<IClawRefProps>
}



const Claw = () => {

};


/**
 * 爪子
 * @param ref
 */
const Claws = ({
    ref
}: IProps) => {

    const grabStateRef = useRef<EGrabState>(EGrabState.idle);

    const [cableLength, setCableLength] = useState(0);
    const clawPosition = useRef<[number, number, number]>([1, initY, 2]);

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

    // 爪子手臂 - 更加复杂的结构
    const armProps: IArmProps[] = grabStateRef.current === EGrabState.down ? [
        // 爪子内侧位置 (抓取状态)
        {position: [0.8, arm1.y, 0.8], args: arm1.args, rotation: [0, 0, 0.3]},
        {position: [-0.8, arm1.y, 0.8], args: arm1.args, rotation: [0, 0, -0.3]},
        {position: [0.8, arm1.y, -0.8], args: arm1.args, rotation: [0, 0, 0.3]},

    ] : [
        // 爪子外侧位置 (非抓取状态)
        {position: [0, 0, 0], args: arm1.args, rotation: [0, 1, 0]},
        {position: [0, 0, 0], args: arm1.args, rotation: [0, 0, 0]},
        {position: [0, 0, 0], args: arm1.args, rotation: [0,0, 0]},
    ];

    // 爪子连接部分
    const connectorProps: { position: [number, number, number], args: [number, number, number] }[] = [
        {position: [0, baseY, 0], args: [0.5, 0.5, 0.5]},
        {position: [0, base2Y, 0], args: [0.5, 0.5, 0.5]},
    ];

    // useImperativeHandle(ref, () => ({
    //     startMoving,
    //     stopMoving,
    // }));

    return (
        <RigidBody
            ref={clawRef}
            type="dynamic"
            position={[clawPosition.current[0], initY - cableLength, clawPosition.current[2]]}
            colliders="cuboid"
            canSleep={false}
            userData={{tag: 'Claw'}}
            lockRotations // 锁定旋转
            gravityScale={0} // 设置重力缩放为0，这样就不会受重力影响
            friction={5.5} // 增加摩擦力
            linearDamping={5.5} // 增加线性阻尼
        >

            {/*<Arm*/}
            {/*    // position={props.position}*/}
            {/*    // rotation={props.rotation}*/}
            {/*/>*/}
            {/* 爪子手臂 */}
            {armProps.map((props, i) => {
                return <Arm
                    key={`arm-${i}`}
                    position={props.position}
                    rotation={props.rotation}
                />;
            })}
        </RigidBody>
    );
};

export default Claws;
