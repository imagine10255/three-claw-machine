import {Html, useTexture} from '@react-three/drei';
import {motion} from "framer-motion-3d";
import {useThree} from '@react-three/fiber';
import styled, {css, keyframes} from 'styled-components';
import {animateConfig} from '../config.ts';
const container = './images/container.png'

interface IProps {
    x: number,
    y:number,
    prizeUrl: string,
    isRotate: boolean,
    isActive: boolean,
    text?: string,
}

function Prize ({
    x,
    y,
    prizeUrl,
    isRotate,
    isActive,
    text = '',
}:IProps) {
    const boxTexture = useTexture(container);
    const {size} = useThree();

    return (
        <group>
            <motion.mesh
                position={[x,y,0]}
            >
                <circleGeometry args={[.75, 128]}/>
                <meshBasicMaterial map={boxTexture} />
            </motion.mesh>

            <PrizeImage
                position={[x,y,0]}
                center
                prizeUrl={prizeUrl}
                width={size.width}
                isRotate={isRotate}
                isActive={isActive}
            >
                {text}
            </PrizeImage>
        </group>
    );
}

export default Prize;

const shake = keyframes`
    0% {
      transform: translate3d(-50%, -50%, 0);
    }
    50% {
      transform: translate3d(-50%, -45%, 0);
    }
    100% {
      transform: translate3d(-50%, -50%, 0);
    }
`;

const PrizeImage = styled(Html)<{
    prizeUrl: string,
    width: number,
    isRotate: boolean,
    isActive: boolean,
}>`
    background-image: url(${props => props.prizeUrl});
    background-size: cover;
    background-repeat: no-repeat;
    width: ${props => props.width * .1}px;
    aspect-ratio: 1;
    pointer-events: none;
  
    animation-name: ${props => props.isRotate ? shake : 'none'};
    animation-delay: ${animateConfig.zoomOutDelay + .3}s;
    animation-duration: .5s;
    animation-timing-function: ease-in;

    ${props => props.isRotate && props.isActive && css`
      filter: drop-shadow(0 -5px 15px yellow);
    `}
    transition: filter 1s ${animateConfig.zoomOutDelay}s ease-in;
  
    // for debug
    color: #fff;
`;