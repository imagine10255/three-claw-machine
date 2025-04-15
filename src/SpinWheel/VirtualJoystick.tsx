import { useEffect, useRef } from 'react';
import nipplejs, { JoystickManager, JoystickManagerOptions, EventData, JoystickOutputData } from 'nipplejs';
import styled from 'styled-components';
import {Quaternion, Vector3} from "three";
import {useFrame} from "@react-three/fiber";

interface IPosition {
    x: number
    y: number
    z: number
}

interface Props {
    // onMove: (position: IPosition) => void;
    onMove: (direction: string) => void;
    onMoveEnd?: () => void;
}

const VirtualJoystick = ({
  onMove,
  onMoveEnd
}: Props) => {
    const joystickRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<JoystickManager | null>(null);
    const moveIntervalRef = useRef<JoystickOutputData>();

    let canmove = false;
    const lastPositionRef = useRef({x: 0, y: 0});


    // useFrame((state, delta) => {
    //     move(delta);
    //
    // });


    useEffect(() => {
        if (!joystickRef.current) return;

        const options: JoystickManagerOptions = {
            zone: joystickRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white',
            size: 100,
            lockX: false,
            lockY: false,
        };

        managerRef.current = nipplejs.create(options);

        // 監聽搖桿移動事件
        managerRef.current.on("start", function (evt, data) {
            canmove = true;
            // hostWalk();   //人物行走动画
            // controls.enabled = false;
            console.log('xxx');
            lastPositionRef.current = {
                x: data.position.x,
                y: data.position.y,
            };
        });

        managerRef.current.on('move', (_: EventData, data: JoystickOutputData) => {
            const forward = new Vector3(0, 0, 0);
            console.log('222');

            const qqq = new Quaternion();

            // forward.copy(playerforward);
            // forward.applyQuaternion(qqq);
            // forward.normalize();
            // forward.multiplyScalar(movedistance * 0.01 * delta);
            console.log('data.direction?.x', data.direction);
            onMove(data.direction?.angle);
            // moveIntervalRef.current = data;
            /*if (data.direction) {
                canmove = true;
                // peopleObj.movedistance = data.distance;
                if (data.direction) {
                    onMove({
                        x: lastPositionRef.current.x + data.position.x,
                        y: 0,
                        z: lastPositionRef.current.y + data.position.y
                    })
                }
            }*/




            // if (!data.direction || !data.force) return;
            // canmove = true;
            //
            // // 根據方向映射
            // const directionMap: { [key: string]: string } = {
            //     'up': 'forward',
            //     'down': 'backward',
            //     'left': 'left',
            //     'right': 'right'
            // };
            //
            // // 計算力度 (0-1 之間)
            // const normalizedForce = Math.min(data.force / 2, 1);
            //
            // if (data.direction.angle) {
            //     const direction = directionMap[data.direction.angle] || data.direction.angle;
            //     // onMove(direction, normalizedForce);
            // }
        });

        // 監聽搖桿結束移動事件
        managerRef.current.on('end', () => {
            onMoveEnd?.();
        });

        return () => {
            // if (moveIntervalRef.current) {
            //     clearInterval(moveIntervalRef.current);
            // }
            managerRef.current?.destroy();
        };
    }, [onMove, onMoveEnd]);


    const move = (delta: number) => {
        // move.x = (keysPressed.current.has('ArrowRight') ? 1 : 0) - (keysPressed.current.has('ArrowLeft') ? 1 : 0);
        // move.z = (keysPressed.current.has('ArrowDown') ? 1 : 0) - (keysPressed.current.has('ArrowUp') ? 1 : 0);
        // move.normalize();

        // if (!move.equals(new Vector3(0, 0, 0))) {
        //     currentForce.current += move.length() * baseSpeed;
        //     currentForce.current = Math.min(currentForce.current, baseSpeed);
        // } else {
        //     currentForce.current = Math.max(currentForce.current - lerpFactor, 0);
        // }
        const move = new Vector3();
        if(moveIntervalRef.current){
            if(moveIntervalRef.current.direction){
                const position = moveIntervalRef.current.position;
                onMove(moveIntervalRef.current.direction.x || moveIntervalRef.current.direction.y);
                // onMove({
                //     x: lastPositionRef.current.x + position.x,
                //     y: 0,
                //     z: lastPositionRef.current.y + position.y
                // })
            }
        }


    }






    return <JoystickContainer ref={joystickRef} />;
};

export default VirtualJoystick;





const JoystickContainer = styled.div`
    width: 150px;
    height: 150px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    touch-action: none;
    user-select: none;
`;
