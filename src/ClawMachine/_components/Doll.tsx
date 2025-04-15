
// 娃娃组件
import {useSphere} from '@react-three/cannon';


interface DollProps {
    position: [number, number, number]
    color: string
    size?: number
}


function Doll({position, color, size = 2}: DollProps) {
    const [ref] = useSphere<any>(() => ({
        mass: 1,
        position,
        args: [size / 2],
        type: 'Dynamic'
    }));

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[size / 2, 32, 32]} />
            <meshStandardMaterial
                color={color}
                metalness={0.1}
                roughness={0.2}
                emissive={color}
                emissiveIntensity={0.2}
            />
        </mesh>
    );
}

export default Doll;
