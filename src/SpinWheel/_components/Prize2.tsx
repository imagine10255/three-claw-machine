import {Html} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import styled, {css, keyframes} from 'styled-components';
import {animateConfig} from '../config.ts';

const container = './images/container.png'
const duration = animateConfig.zoomOutDelay + animateConfig.defaultDuration;

interface IProps {
    x: number,
    y:number,
    prizeUrl: string,
    isRotate: boolean,
    isActive: boolean,
    text?: string,
}

function Prize2 ({
    x,
    y,
    prizeUrl,
    isRotate,
    isActive,
    text = '',
}:IProps) {
    const {size} = useThree();

    return (
        <PrizeImage
            position={[x,y,0]}
            center
            prizeUrl={prizeUrl}
            width={size.width * .1}
            isRotate={isRotate}
            isActive={isActive}
        >
            {text}
        </PrizeImage>
    );
}

export default Prize2;

// 獎品 抖動 動畫
const shake = keyframes`
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0, -10px, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
`;

// 外框 放大縮小動畫
const scale = keyframes`
    0% {
      transform: translate3d(-50%, -50%, 0) scale(1);
    }
    5% {
      transform: translate3d(-50%, -50%, 0) scale(1.1);
    }
    95% {
      transform: translate3d(-50%, -50%, 0) scale(1.1);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) scale(1);
    }
`;

const PrizeImage = styled(Html)<{
    prizeUrl: string,
    width: number,
    isRotate: boolean,
    isActive: boolean,
}>`
    display: flex;
    justify-content: center;
    align-items: center;

    background-image: url(${container});
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 100%;

    width: ${props => props.width * 2}px;
    aspect-ratio: 1;
    pointer-events: none;
    transition: width .5s .5s ease-in;

    animation-name: ${props => props.isRotate ? scale : 'none'};
    animation-duration: ${duration}s;
    animation-timing-function: ease-out;

    // for debug
    color: #fff;

    &:before {
        content: '';
        display: block;
        width: ${props => props.width}px;
        aspect-ratio: 1;

        background-image: url(${props => props.prizeUrl});
        background-size: cover;
        background-repeat: no-repeat;
        
        animation-name: ${props => props.isRotate ? shake : 'none'};
        animation-delay: ${duration}s;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;

        ${props => props.isRotate && props.isActive && css`
            filter: drop-shadow(0 -5px 15px yellow);
            transition: filter 1s ${duration}s ease-in;
        `}
    }

`;

