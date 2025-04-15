import {Physics} from '@react-three/cannon';
import {OrbitControls} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useMemo, useState} from 'react';
import {Color} from 'three';

import Boxes from './_components/Boxes';
import Plane from './_components/Plane';
import Spheres from './_components/Spheres';

const niceColors = ['#99b898', '#fecea8', '#ff847c', '#e84a5f', '#2a363b'];



const instancedGeometry = {
    box: Boxes,
    sphere: Spheres,
};


/**
 * DemoCubeHeap
 */
const DemoCubeHeap = () => {
    const [geometry, setGeometry] = useState<'box' | 'sphere'>('box');
    const [number] = useState(200);
    const [size] = useState(0.1);

    const colors = useMemo(() => {
        const array = new Float32Array(number * 3);
        const color = new Color();
        for (let i = 0; i < number; i++)
            color
                .set(niceColors[Math.floor(Math.random() * 5)])
                .convertSRGBToLinear()
                .toArray(array, i * 3);
        return array;
    }, [number]);

    const InstancedGeometry = instancedGeometry[geometry];

    return (
        <Canvas
            camera={{fov: 50, position: [-1, 1, 2.5]}}
            onCreated={({scene}) => (scene.background = new Color('lightblue'))}
            onPointerMissed={() => setGeometry((geometry) => (geometry === 'box' ? 'sphere' : 'box'))}
            shadows
        >
            <OrbitControls makeDefault />

            <hemisphereLight intensity={0.35 * Math.PI} />
            <spotLight
                angle={0.3}
                castShadow
                decay={0}
                intensity={2 * Math.PI}
                penumbra={1}
                position={[10, 10, 10]}
            />
            <Physics broadphase="SAP">
                <Plane rotation={[-Math.PI / 2, 0, 0]} />
                <InstancedGeometry {...{colors, number, size}} />
            </Physics>
        </Canvas>
    );
};

export default DemoCubeHeap;
