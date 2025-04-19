import {ImpulseJointHandle, JointType} from '@dimforge/rapier3d-compat/dynamics/impulse_joint';
import {RigidBody} from '@dimforge/rapier3d-compat/dynamics/rigid_body';
import {RigidBodySet} from '@dimforge/rapier3d-compat/dynamics/rigid_body_set';
import {Rotation, Vector} from '@dimforge/rapier3d-compat/math';
import {RawImpulseJointSet} from '@dimforge/rapier3d-compat/raw';

declare class ImpulseJoint {
    protected rawSet: RawImpulseJointSet;
    protected bodySet: RigidBodySet;
    handle: ImpulseJointHandle;
    constructor(rawSet: RawImpulseJointSet, bodySet: RigidBodySet, handle: ImpulseJointHandle);
    static newTyped(rawSet: RawImpulseJointSet, bodySet: RigidBodySet, handle: ImpulseJointHandle): ImpulseJoint;
    /** @internal */
    finalizeDeserialization(bodySet: RigidBodySet): void;
    /**
     * Checks if this joint is still valid (i.e. that it has
     * not been deleted from the joint set yet).
     */
    isValid(): boolean;
    /**
     * The first rigid-body this joint it attached to.
     */
    body1(): RigidBody;
    /**
     * The second rigid-body this joint is attached to.
     */
    body2(): RigidBody;
    /**
     * The type of this joint given as a string.
     */
    type(): JointType;
    /**
     * The rotation quaternion that aligns this joint's first local axis to the `x` axis.
     */
    frameX1(): Rotation;
    /**
     * The rotation matrix that aligns this joint's second local axis to the `x` axis.
     */
    frameX2(): Rotation;
    /**
     * The position of the first anchor of this joint.
     *
     * The first anchor gives the position of the application point on the
     * local frame of the first rigid-body it is attached to.
     */
    anchor1(): Vector;
    /**
     * The position of the second anchor of this joint.
     *
     * The second anchor gives the position of the application point on the
     * local frame of the second rigid-body it is attached to.
     */
    anchor2(): Vector;
    /**
     * Sets the position of the first anchor of this joint.
     *
     * The first anchor gives the position of the application point on the
     * local frame of the first rigid-body it is attached to.
     */
    setAnchor1(newPos: Vector): void;
    /**
     * Sets the position of the second anchor of this joint.
     *
     * The second anchor gives the position of the application point on the
     * local frame of the second rigid-body it is attached to.
     */
    setAnchor2(newPos: Vector): void;
    /**
     * Controls whether contacts are computed between colliders attached
     * to the rigid-bodies linked by this joint.
     */
    setContactsEnabled(enabled: boolean): void;
    /**
     * Indicates if contacts are enabled between colliders attached
     * to the rigid-bodies linked by this joint.
     */
    contactsEnabled(): boolean;
}
