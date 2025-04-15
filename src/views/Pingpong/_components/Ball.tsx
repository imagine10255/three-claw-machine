import {useSphere} from '@react-three/cannon';
import {useLoader} from '@react-three/fiber';
import {useRef} from 'react';
import {type Mesh, TextureLoader} from 'three';

import earthImg from '../resources/cross.jpg';


/**
 * Ball
 */
const Ball = () => {
    const map = useLoader(TextureLoader, earthImg);
    const [ref] = useSphere(() => ({args: [0.5], mass: 1, position: [0, 5, 0]}), useRef<Mesh>(null));
    return (
        <mesh castShadow ref={ref}>
            <sphereGeometry args={[0.5, 64, 64]} />
            <meshStandardMaterial map={map} />
        </mesh>
    );
};

export default Ball;
