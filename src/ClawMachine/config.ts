import {IConfig} from './types.ts';

const radius = 2;
const sin = Math.sin( Math.PI / 4 ) * radius;
const cos = Math.cos( Math.PI / 4 ) * radius;

export const config: IConfig[] = [
    {
        position: {x: 0, y: radius},
    },
    {
        position: {x: cos, y: sin},
    },
    {
        position: {x: radius, y: 0},
    },
    {
        position: {x: cos, y: -sin},
    },
    {
        position: {x: 0, y: -radius},
    },
    {
        position: {x: -cos, y: -sin},
    },
    {
        position: {x: -radius, y: 0},
    },
    {
        position: {x: -cos, y: sin},
    },
];

// 動畫共分為三個階段：放大 旋轉 縮小
const zoomInDuration = .5;

const rotateDelay = zoomInDuration;
const rotateDuration = 4; // 四秒才會符合 rive 動畫

const zoomOutDelay = zoomInDuration + rotateDuration;

const defaultDuration = .3;

export const animateConfig = {
    zoomInDuration,

    rotateDelay,
    rotateDuration,

    zoomOutDelay,

    defaultDuration, // motion canvas 預設的 duration
};