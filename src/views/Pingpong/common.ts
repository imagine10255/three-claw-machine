import clamp from 'lodash-es/clamp';
import type {Group, Material, Mesh, Object3D, Skeleton} from 'three';
import type {GLTF} from 'three-stdlib/loaders/GLTFLoader';
import {create} from 'zustand';

import pingSound from './resources/ping.mp3';

type State = {
    api: {
        pong: (velocity: number) => void,
        reset: (welcome: boolean) => void,
    },
    count: number,
    welcome: boolean,
}

export const ping = new Audio(pingSound);
export const useStore = create<State>((set) => ({
    api: {
        pong(velocity) {
            ping.currentTime = 0;
            ping.volume = clamp(velocity / 20, 0, 1);
            ping.play();
            if (velocity > 4) set((state) => ({count: state.count + 1}));
        },
        reset: (welcome) => set((state) => ({count: welcome ? state.count : 0, welcome})),
    },
    count: 0,
    welcome: true,
}));

export type PingPongGLTF = GLTF & {
    materials: Record<'foam' | 'glove' | 'lower' | 'side' | 'upper' | 'wood', Material>,
    nodes: Record<'Bone' | 'Bone003' | 'Bone006' | 'Bone010', Object3D> &
        Record<'mesh' | 'mesh_1' | 'mesh_2' | 'mesh_3' | 'mesh_4', Mesh> & {
        arm: Mesh & { skeleton: Skeleton },
    },
}

