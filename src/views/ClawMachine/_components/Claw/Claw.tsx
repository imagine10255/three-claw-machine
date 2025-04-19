// 爪子组件
import {useFrame} from '@react-three/fiber';
import {RapierRigidBody,RigidBody, useFixedJoint} from '@react-three/rapier';
import React, {ForwardedRef, forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

import Arm, {IArmRefProps} from './Arm';
import Cable from './Cable';
import {EDirectionState, EGrabState, IArm4Props, IArmProps, TPosition, TRotation} from './types';

const initY = 11;
const maxCableLength = 20; // 最大绳子长度



export interface IClawRefProps {
    setGrab: (isGrab: boolean) => void
}


interface IProps {
    ref?: ForwardedRef<RapierRigidBody>
    position: [x: number, y: number, z: number]
    controlRef: RefObject<IArmRefProps|null>
}


/**
 * 爪子
 * @param ref
 * @param controlRef
 * @param position
 */
const Claws = ({
    ref,
    controlRef,
    position
}: IProps) => {
    const armRef = [
        useRef<IArmRefProps>(null),
        useRef<IArmRefProps>(null),
        useRef<IArmRefProps>(null),
    ];


    // 爪子手臂 - 围绕中心点旋转
    const armRotations: TRotation[] = [
        [0, 0, 0],
        [0, 2.2, 0],
        [0, 4.4, 0]
    ];


    useImperativeHandle(controlRef, () => ({
        setGrab,
    }));


    const setGrab = (isGrab: boolean) => {
        armRef.forEach(row => {
            row.current?.setGrab(isGrab);
        });
    };


    return (

        <RigidBody
            ref={ref}
            type="dynamic"
            position={position}
            angularDamping={2}
            linearDamping={2}
        >
            <mesh
                position={[0,0,0]}
                castShadow
                receiveShadow
            >
                <cylinderGeometry args={[0.4, 0.4, .5, 32]} />
                <meshStandardMaterial color="blue" />
            </mesh>

            <mesh
                position={[0,-.5,0]}
                castShadow
                receiveShadow
            >
                <cylinderGeometry args={[0.6, 0.4, .6, 32]} />
                <meshStandardMaterial color="blue" />
            </mesh>


            {/* 爪子手臂 */}
            {armRotations.map((rotation, i) => {
                return <Arm
                    controlRef={armRef[i]}
                    key={`arm-${i}`}
                    position={[0,-1.0,0]}
                    rotation={rotation}
                />;
            })}
        </RigidBody>
    );
};

export default Claws;
