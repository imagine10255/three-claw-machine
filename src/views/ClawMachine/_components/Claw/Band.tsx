import Rapier, {ImpulseJoint} from '@dimforge/rapier3d-compat';
import {Canvas, extend, RootState, useFrame, useThree} from '@react-three/fiber';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RapierRigidBody,
    RigidBody,
    useRapier,
    useRopeJoint,
    useSphericalJoint,
} from '@react-three/rapier';
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';
import {RefObject, useEffect, useMemo,useRef, useState} from 'react';
import * as THREE from 'three';
import {Vector3} from 'three';

import {useMyRopeJoint} from '@/views/ClawMachine/_components/Claw/hooks';
import {EDirectionState, EGrabState} from '@/views/ClawMachine/_components/Claw/types';

import Claw, {IClawRefProps} from './Claw';

extend({MeshLineGeometry, MeshLineMaterial});

const Band = () => {
    const currentDirection = useRef<string | null>(null);
    const band = useRef<THREE.Mesh>(null);
    const fixed = useRef<RapierRigidBody>(null);
    const j0 = useRef<RapierRigidBody>(null);
    const j1 = useRef<RapierRigidBody>(null);
    const j2 = useRef<RapierRigidBody>(null);
    const card = useRef<RapierRigidBody>(null); // prettier-ignore
    const clawControlRef = useRef<IClawRefProps>(null); // prettier-ignore
    const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3(); // prettier-ignore
    const {width, height} = useThree((state) => state.size);
    const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
    const [dragged, drag] = useState<{x: number, y: number, z: number}| false>(false);
    const grabStateRef = useRef<EGrabState>(EGrabState.idle);
    const moveRef = useRef<THREE.Mesh>(null);
    const {removeJoint, createImpulseJoint, createMultipleJoints} = useMyRopeJoint();
    const ropeLength = useRef(0.3);
    const targetRopeLength = useRef(0.3);
    const ropeSpeed = 0.5; // 控制绳子伸缩速度

    const joint = useRef<ImpulseJoint>(null);

    useEffect(() => {
        joint.current = createImpulseJoint('repo', [
            {ref: fixed, anchor: [0,0,0]},
            {ref: j1, anchor: [0,0,0]},
        ]);
        createMultipleJoints([
            {
                type: 'repo',
                length: ropeLength.current,
                params: [
                    {ref: j1, anchor: [0,0,0]},
                    {ref: j2, anchor: [0,0,0]},
                ],
            },
            {
                type: 'spherical',
                params: [
                    {ref: j2, anchor: [0,0,0]},
                    {ref: card, anchor: [0, 0, 0]},
                ],
            },
        ]);

    }, []);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const direction = getDirectionFromKey(e.code);
            if (direction && [EDirectionState.up, EDirectionState.down, EDirectionState.left, EDirectionState.right].includes(direction)) {
                e.preventDefault();
                startMoving(direction);
            } else if (e.code === 'Space') {
                e.preventDefault();
                if(grabStateRef.current === EGrabState.idle){
                    grabStateRef.current = EGrabState.down;
                    targetRopeLength.current = 8; // 设置目标长度为7
                    clawControlRef.current?.setGrab(true);

                }else if(grabStateRef.current === EGrabState.down){
                    grabStateRef.current = EGrabState.idle;
                    targetRopeLength.current = 1; // 设置目标长度为1
                    clawControlRef.current?.setGrab(false);
                }
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


    useFrame((state, delta) => onMove(delta));
    // useFrame((state, delta) => onGrab(delta));

    useFrame((state, delta) => {
        // 平滑地改变绳子长度
        if (Math.abs(ropeLength.current - targetRopeLength.current) > 0.01) {
            const newLength = THREE.MathUtils.lerp(
                ropeLength.current,
                targetRopeLength.current,
                delta * ropeSpeed
            );
            ropeLength.current = newLength;

            // 更新joint
            if (joint.current) {
                removeJoint(joint);
            }
            joint.current = createImpulseJoint('repo', [
                {ref: fixed, anchor: [0,0,0]},
                {ref: j1, anchor: [0,0,0]},
            ], newLength);
        }

        // if (dragged) {
        //     vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
        //     dir.copy(vec).sub(state.camera.position).normalize();
        //     vec.add(dir.multiplyScalar(state.camera.position.length()))
        //     ;[card, j1, j2, fixed].forEach((ref) => ref.current?.wakeUp());
        //     card.current?.setNextKinematicTranslation({
        //         x: vec.x - dragged.x,
        //         y: vec.y - dragged.y,
        //         z: vec.z - dragged.z
        //     });
        // }


        if (fixed.current &&
            j2.current &&
            j1.current &&
            band.current &&
            card.current
        ) {
            // Calculate catmul curve
            curve.points[0].copy(j2.current.translation());
            curve.points[1].copy(j1.current.translation());
            curve.points[2].copy(fixed.current.translation());
            curve.points[3].copy(fixed.current.translation());
            (band.current.geometry as any).setPoints(curve.getPoints(32));
            // Tilt it back towards the screen
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            (card.current as any).setAngvel({x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z});
        }
    });



    /**
     * 移動爪子
     * @param delta
     */
    const onMove = (delta: number) => {
        // if (grabStateRef.current === EGrabState.down) return;
        if (!currentDirection.current || !fixed.current) return;

        const speed = 5;
        const currentPos = fixed.current.translation();
        let newX = currentPos.x;
        let newZ = currentPos.z;

        switch (currentDirection.current) {
        case EDirectionState.left:
            newX = Math.max(-5, currentPos.x - speed * delta);
            break;
        case EDirectionState.right:
            newX = Math.min(5, currentPos.x + speed * delta);
            break;
        case EDirectionState.up:
            newZ = Math.max(-5, currentPos.z - speed * delta);
            break;
        case EDirectionState.down:
            newZ = Math.min(5, currentPos.z + speed * delta);
            break;
        }

        fixed.current.setNextKinematicTranslation({
            x: newX,
            y: currentPos.y,
            z: newZ
        });
    };


    /**
     * 抓取
     * @param delta
     */
    const onGrab = (delta: number) => {
        if(!moveRef.current) return;

        if (grabStateRef.current === EGrabState.down) {
            // 当抓取状态为 down 时，逐渐增加长度
            moveRef.current.scale.y += delta;
        } else if (grabStateRef.current === EGrabState.up) {
            // 当抓取状态为 up 时，逐渐减少长度
            // setRepoLength(prev => Math.max(1, prev - delta * 0.5));
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
            <group position={[0, 12, 0]}>
                <RigidBody ref={fixed}
                    angularDamping={2}
                    linearDamping={2}
                    type="kinematicPosition"
                />
                <RigidBody position={[0.5, 0, 0]}
                    args={[.1, 1, .1]}
                    ref={j1}
                    angularDamping={1}
                    linearDamping={1}
                >
                    <BallCollider args={[0.1]}/>
                </RigidBody>

                <RigidBody position={[1, 0, 0]} ref={j2} angularDamping={2} linearDamping={2}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>

                <Claw
                    ref={card}
                    controlRef={clawControlRef}
                    position={[1.5, 0, 0]}
                />

            </group>


            <mesh ref={band}>
                <meshLineGeometry/>
                <meshLineMaterial opacity={1} color="#000" depthTest={false}
                    resolution={[width, height]} lineWidth={.2}/>
            </mesh>


        </>
    );
};


export default Band;
