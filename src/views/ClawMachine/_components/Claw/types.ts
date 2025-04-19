import {EulerOrder} from "three/src/math/Euler";

export interface IArmProps {
    position: [number, number, number]
    rotation: [number, number, number]
    args: [number, number, number]
}
export interface IArm3Props {
    position?: TPosition
    rotation?: TRotation
}

export interface IArm2Props {
    position: [number, number, number]
    args: [number, number, number]
    rotation: [number, number, number]
}

export interface IArm4Props {
    rotation: [number, number, number]
}

export type TPosition = [x: number, y: number, z: number];
export type TRotation = [x: number, y: number, z: number, order?: EulerOrder];

export interface IClawRefProps {
    startMoving: (direction: EDirectionState) => void
    stopMoving: () => void
}


export enum EGrabState {
    idle = 'idle',
    down = 'down',
    up = 'up',
}
export enum EDirectionState {
    down = 'down',
    up = 'up',
    left = 'left',
    right = 'right',
}
