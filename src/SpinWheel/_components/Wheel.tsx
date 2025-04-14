import {motion} from "framer-motion-3d";
import {useTexture} from '@react-three/drei';

const wheel = './images/wheel.jpeg';


function Wheel() {
    const texture = useTexture(wheel)
    return (
        <motion.mesh>
            <circleGeometry args={[2, 128]}/>
            <meshBasicMaterial
                map={texture}
            />
        </motion.mesh>
    );
}

export default Wheel;