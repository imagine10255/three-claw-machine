import { useEffect, useRef } from 'react';
import nipplejs, { JoystickManager, JoystickManagerOptions, EventData, JoystickOutputData } from 'nipplejs';
import styled from 'styled-components';

interface Props {
    onMove: (direction: string, force: number) => void;
    onMoveEnd?: () => void;
}

const VirtualJoystick = ({
  onMove,
  onMoveEnd
}: Props) => {
    const joystickRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<JoystickManager | null>(null);
    const moveIntervalRef = useRef<number | null>(null);

    let canmove = false;
    const lastPositionRef = useRef({x: 0, y: 0});

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
            lastPositionRef.current = {
                x: data.position.x,
                y: data.position.y,
            };
        });

        managerRef.current.on('move', (_: EventData, data: JoystickOutputData) => {

            if (data.direction) {
                canmove = true;
                // peopleObj.movedistance = data.distance;
                // if (data.direction) {
                //     playerforward.set(
                //         lastpx - data.position.x,
                //         0,
                //         lastpy - data.position.y
                //     );
                // }
            }




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
            // onMoveEnd?.();
        });

        return () => {
            if (moveIntervalRef.current) {
                clearInterval(moveIntervalRef.current);
            }
            managerRef.current?.destroy();
        };
    }, [onMove, onMoveEnd]);

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
