import {Canvas, extend, useFrame, useThree} from '@react-three/fiber';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RapierRigidBody,
    RigidBody,
    useRopeJoint,
    useSphericalJoint
} from '@react-three/rapier';
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';
import {RefObject, useRef, useState} from 'react';
import * as THREE from 'three';

extend({MeshLineGeometry, MeshLineMaterial});

const Band = () => {
    const band = useRef<THREE.Mesh>(null);
    const fixed = useRef<RapierRigidBody>(null);
    const j1 = useRef<RapierRigidBody>(null);
    const j2 = useRef<RapierRigidBody>(null);
    const j3 = useRef<RapierRigidBody>(null);
    const card = useRef<RapierRigidBody>(null); // prettier-ignore
    const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3(); // prettier-ignore
    const {width, height} = useThree((state) => state.size);
    const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
    const [dragged, drag] = useState<{x: number, y: number, z: number}| false>(false);

    useRopeJoint(
        fixed as RefObject<RapierRigidBody>,
        j1 as RefObject<RapierRigidBody>,
        [[0, 0, 0], [0, 0, 0], 1]
    ); // prettier-ignore
    useRopeJoint(
        j1 as RefObject<RapierRigidBody>,
        j2 as RefObject<RapierRigidBody>,
        [[0, 0, 0], [0, 0, 0], 1]
    ); // prettier-ignore
    useRopeJoint(
        j2 as RefObject<RapierRigidBody>,
        j3 as RefObject<RapierRigidBody>,
        [[0, 0, 0], [0, 0, 0], 1]
    ); // prettier-ignore
    useSphericalJoint(
        j3 as RefObject<RapierRigidBody>,
        card as RefObject<RapierRigidBody>,
        [[0, 0, 0], [0, 1.45, 0]]
    ); // prettier-ignore

    useFrame((state, delta) => {
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()))
            ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z
            });
        }
        if (fixed.current &&
            j3.current &&
            j2.current &&
            j1.current &&
            band.current &&
            card.current
        ) {
            // Calculate catmul curve
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.translation());
            curve.points[2].copy(j1.current.translation());
            curve.points[3].copy(fixed.current.translation());
            (band.current.geometry as any).setPoints(curve.getPoints(32));
            // Tilt it back towards the screen
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            (card.current as any).setAngvel({x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z});
        }
    });

    return (
        <>
            <group position={[0, 12, 0]}>
                <RigidBody ref={fixed} angularDamping={2} linearDamping={2} type="fixed"/>
                <RigidBody position={[0.5, 0, 0]} ref={j1} angularDamping={2} linearDamping={2}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} angularDamping={2} linearDamping={2}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} angularDamping={2} linearDamping={2}>
                    <BallCollider args={[0.1]}/>
                </RigidBody>
                <RigidBody position={[2, 0, 0]} ref={card} angularDamping={2} linearDamping={2}
                    type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]}/>
                    <mesh
                        onPointerUp={(e: any) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
                        onPointerDown={(e: any) => {
                            if(card.current){
                                return e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                            }
                        }}>
                        <planeGeometry args={[0.8 * 2, 1.125 * 2]}/>
                        <meshBasicMaterial transparent opacity={0.25} color="white" side={THREE.DoubleSide}/>
                    </mesh>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry/>
                <meshLineMaterial transparent opacity={0.25} color="white" depthTest={false}
                    resolution={[width, height]} lineWidth={1}/>
            </mesh>
        </>
    );
};


export default Band;
