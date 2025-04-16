import {Triplet} from '@react-three/cannon';
import {useMemo} from 'react';

import Box from './Box';

interface InstancedGeometryProps {
    colors: Float32Array
    number: number
    size: number
}


/**
 * 多個箱子
 * @param colors
 * @param number
 * @param size
 */
const Boxes = ({colors, number, size}: InstancedGeometryProps) => {
    const boxes = useMemo(() => {
        return Array.from({length: number}, (_, i) => {
            const position: Triplet = [
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 10
            ];
            const color: [number, number, number] = [
                colors[i * 3],
                colors[i * 3 + 1],
                colors[i * 3 + 2]
            ];
            return {position, color, index: i};
        });
    }, [number, size, colors]);

    return (
        <>
            {boxes.map(({position, color, index}) => {
                return <Box key={index} position={position} color={color} size={size} index={index} />;
            })}
        </>
    );
};

export default Boxes;
