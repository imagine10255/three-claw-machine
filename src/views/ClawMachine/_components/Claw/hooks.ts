import {Vector} from '@dimforge/rapier3d-compat/math';
import {RapierRigidBody, useRapier} from '@react-three/rapier';
import {RefObject} from 'react';


interface IParam {
    ref: RefObject<RapierRigidBody|null>
    anchor: [x: number, y: number, z: number]
}

export const useMyRopeJoint = () => {
    const {world, rapier} = useRapier();


    /**
     * 建立關聯
     * @param length
     * @param params
     * @param type
     */
    const createImpulseJoint = (
        type: 'repo'|'spherical',
        params: [
            param1: IParam,
            param2: IParam
        ],
        length = 1,
    ) => {
        const param1 = params[0];
        const param2 = params[1];
        if(
            !param1.ref.current ||
            !param2.ref.current
        ) return;

        const anchorA = new rapier.Vector3(param1.anchor[0], param1.anchor[1], param1.anchor[2]);
        const anchorB = new rapier.Vector3(param2.anchor[0], param2.anchor[1], param2.anchor[2]);

        switch (type) {
        case 'repo':
            const jointRepo = rapier.JointData.rope(
                length,                              // 繩子最大長度
                anchorA,  // anchor1
                anchorB   // anchor2
            );
            world.createImpulseJoint(jointRepo, param1.ref.current, param2.ref.current, true);

            break;

        case 'spherical':
            const jointSpherical = rapier.JointData.spherical(
                anchorA,  // anchor1
                anchorB   // anchor2
            );
            world.createImpulseJoint(jointSpherical, param1.ref.current, param2.ref.current, true);
            break;
        }

    };

    /**
     * 建立多個連接點
     * @param data
     */
    const createMultipleJoints = (data: Array<{
        params: [param1: IParam, param2: IParam],
        length?: number,
        type: 'repo'|'spherical',
    }>) => {
        data.forEach(({length, params, type}) => {
            createImpulseJoint(type, params, length);
        });
    };

    return {
        createImpulseJoint,
        createMultipleJoints,
    };

};



