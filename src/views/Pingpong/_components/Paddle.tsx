import {useBox} from '@react-three/cannon';
import {useGLTF} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import lerp from 'lerp';
import {useRef} from 'react';
import type {Group, Mesh} from 'three';

import {PingPongGLTF, useStore} from '../common';
import Text from '../Text';


/**
 * Paddle 球拍
 */
const Paddle = () => {
    const {nodes, materials} = useGLTF('/static/glb/pingpong.glb', '/static/glb/draco-gltf/');

    const asNodes = nodes as PingPongGLTF['nodes'];
    const {pong} = useStore((state) => state.api);
    const welcome = useStore((state) => state.welcome);
    const count = useStore((state) => state.count);
    const model = useRef<Group>(null);
    const [ref, api] = useBox(
        () => ({
            args: [3.4, 1, 3],
            onCollide: (e) => pong(e.contact.impactVelocity),
            type: 'Kinematic',
        }),
        useRef<Mesh>(null),
    );
    const values = useRef([0, 0]);
    useFrame((state) => {
        values.current[0] = lerp(values.current[0], (state.mouse.x * Math.PI) / 5, 0.2);
        values.current[1] = lerp(values.current[1], (state.mouse.x * Math.PI) / 5, 0.2);
        api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0);
        api.rotation.set(0, 0, values.current[1]);
        if (!model.current) return;
        model.current.rotation.x = lerp(model.current.rotation.x, welcome ? Math.PI / 2 : 0, 0.2);
        model.current.rotation.y = values.current[0];
    });

    return (
        <mesh ref={ref} dispose={null}>
            <group ref={model} position={[-0.05, 0.37, 0.3]} scale={[0.15, 0.15, 0.15]}>
                <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 2]} count={count.toString()} />
                <group rotation={[1.88, -0.35, 2.32]} scale={[2.97, 2.97, 2.97]}>
                    <primitive object={nodes.Bone} />
                    <primitive object={nodes.Bone003} />
                    <primitive object={nodes.Bone006} />
                    <primitive object={nodes.Bone010} />
                    <skinnedMesh
                        castShadow
                        receiveShadow
                        material={materials.glove}
                        material-roughness={1}
                        geometry={asNodes.arm.geometry}
                        skeleton={asNodes.arm.skeleton}
                    />
                </group>
                <group rotation={[0, -0.04, 0]} scale={[141.94, 141.94, 141.94]}>
                    <mesh castShadow receiveShadow material={materials.wood} geometry={asNodes.mesh.geometry} />
                    <mesh castShadow receiveShadow material={materials.side} geometry={asNodes.mesh_1.geometry} />
                    <mesh castShadow receiveShadow material={materials.foam} geometry={asNodes.mesh_2.geometry} />
                    <mesh castShadow receiveShadow material={materials.lower} geometry={asNodes.mesh_3.geometry} />
                    <mesh castShadow receiveShadow material={materials.upper} geometry={asNodes.mesh_4.geometry} />
                </group>
            </group>
        </mesh>
    );
};

export default Paddle;
