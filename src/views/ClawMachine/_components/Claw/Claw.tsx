// 爪子组件
import {useFrame} from '@react-three/fiber';
import {RapierRigidBody,RigidBody, useFixedJoint} from '@react-three/rapier';
import React, {ForwardedRef, forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

import Arm from './Arm';
import Cable from './Cable';
import {EDirectionState, EGrabState, IArm4Props, IArmProps, IClawRefProps, TPosition, TRotation} from './types';

const initY = 11;
const maxCableLength = 20; // 最大绳子长度


interface IProps {
    ref?: ForwardedRef<RapierRigidBody>
    position: [x: number, y: number, z: number]
}



const Claw = () => {

};


/**
 * 爪子
 * @param ref
 */
const Claws = ({
    ref,
    position
}: IProps) => {

    const grabStateRef = useRef<EGrabState>(EGrabState.idle);

    const [cableLength, setCableLength] = useState(0);
    const clawPosition = useRef<[number, number, number]>([1, initY, 2]);

    const clawRef = useRef<RapierRigidBody>(null);

    const baseY = 10;
    const base2Y = -1;
    const arg1Height = 1.5;
    const arg2Height = 2;

    // 定义中心点
    const centerPoint = [0, 0, 0];
    // 定义爪子到中心点的距离
    const clawRadius = 1.2;

    const arm1 = {
        y: arg1Height / -2,
        args: [.4, arg1Height, .2],
    };
    const arm2 = {
        y: (arg1Height * -1) + (arg2Height / -2) * .6,
        args: [.4, arg2Height, .2],
    };

    // 爪子手臂 - 围绕中心点旋转
    const armRotations: TRotation[] = [
        // [0, 0, 0],
        // [0, 2.2, 0],
        // [0, 4.4, 0]
        // 爪
        [0, 0, 0],
        [0, 2.2, 0],
        [0, 4.4, 0]
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
            ref={ref}
            type="dynamic"
            position={position}
            // colliders="cuboid"
            // canSleep={false}
            // userData={{tag: 'Claw'}}
            // lockRotations // 锁定旋转
            // gravityScale={0} // 设置重力缩放为0，这样就不会受重力影响
            // friction={5.5} // 增加摩擦力
            // linearDamping={5.5} // 增加线性阻尼


            // position={[2, 0, 0]}
            // ref={card}
            angularDamping={2}
            linearDamping={2}
            // type={dragged ? 'kinematicPosition' : 'dynamic'}
            // type="dynamic"

        >

            {/*<Arm*/}
            {/*    // position={props.position}*/}
            {/*    // rotation={props.rotation}*/}
            {/*/>*/}


            <mesh
                // position={armProps[0].position}
                position={[0,0,0]}
                // rotation={[0,0,0]}
                castShadow
                receiveShadow
            >
                <cylinderGeometry args={[0.4, 0.4, .5, 32]} />
                <meshStandardMaterial color="blue" />
            </mesh>

            <mesh
                // position={armProps[0].position}
                position={[0,-.5,0]}
                // rotation={[0,0,0]}
                castShadow
                receiveShadow
            >
                <cylinderGeometry args={[0.6, 0.4, .6, 32]} />
                <meshStandardMaterial color="blue" />
            </mesh>


            {/* 爪子手臂 */}
            {armRotations.map((rotation, i) => {
                return <Arm
                    key={`arm-${i}`}
                    position={[0,-1.0,0]}
                    rotation={rotation}
                />;
            })}
        </RigidBody>
    );
};

export default Claws;
