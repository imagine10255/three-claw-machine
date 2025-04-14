import {useState} from 'react';
import {Canvas} from '@react-three/fiber';
import Group from './_components/Group.tsx';
import Rive from './_components/Rive.tsx';
import styled from 'styled-components';
import {IApi, TTargetIndex} from './types.ts';
import {mergeArrays} from './utils.ts';

interface IProps {
    data: IApi[],
    target: TTargetIndex,
    times?: number,
}

function SpinWheel ({
    data,
    target,
    times,
}: IProps) {
    const [isRotate, setIsRotate] = useState(false);
    const [targetIndex, setTargetIndex] = useState<TTargetIndex>(0);

    return (
        <>
            <Container>
                {/* three js */}
                <Canvas >
                    <Group isRotate={isRotate} targetIndex={targetIndex} data={mergeArrays(data)} times={times}/>
                </Canvas>

                {/* rive */}
                <Rive
                    handleOnSpin={() => setIsRotate(true)}
                    handleOnPressed={() => setTargetIndex(target)}
                />
            </Container>

            {/* demo */}
            {isRotate && <p style={{textAlign: 'center', position: 'fixed', top: '10px', width: '100vw'}}>獎品會落在第{targetIndex}個</p>}
        </>
    );
}

export default SpinWheel;

const Container = styled.div`
    margin: 0 auto;
    position: relative;
    width: min(100vh, 100%); // demo
    aspect-ratio: 1;
    border: 1px solid red;
`;