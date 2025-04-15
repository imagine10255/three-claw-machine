import {usePlane} from '@react-three/cannon';
import {useRef} from 'react';
import type {Mesh} from 'three';

import {useStore} from '../common';


/**
 * ContactGround
 */
const ContactGround = () => {
    const {reset} = useStore((state) => state.api);
    const [ref] = usePlane(
        () => ({
            onCollide: () => reset(true),
            position: [0, -10, 0],
            rotation: [-Math.PI / 2, 0, 0],
            type: 'Static',
        }),
        useRef<Mesh>(null),
    );
    return <mesh ref={ref} />;
};

export default ContactGround;
