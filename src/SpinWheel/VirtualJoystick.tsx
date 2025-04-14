import { useEffect, useRef } from 'react';
import nipplejs, { JoystickManager, JoystickManagerOptions, EventData, JoystickOutputData } from 'nipplejs';
import styled from 'styled-components';

interface Props {
    onMove: (direction: string) => void;
    onMoveEnd?: () => void;
}

const VirtualJoystick: React.FC<Props> = ({ onMove, onMoveEnd }) => {
    const joystickRef = useRef<HTMLDivElement>(null);
    const managerRef = useRef<JoystickManager | null>(null);
    const moveIntervalRef = useRef<number | null>(null);

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
        managerRef.current.on('move', (_: EventData, data: JoystickOutputData) => {
            if (!data.direction) return;
            
            // 根據方向映射
            const directionMap: { [key: string]: string } = {
                'up': 'forward',
                'down': 'backward',
                'left': 'left',
                'right': 'right'
            };

            if (data.direction.angle) {
                const direction = directionMap[data.direction.angle] || data.direction.angle;
                onMove(direction);
            }
        });

        // 監聽搖桿結束移動事件
        managerRef.current.on('end', () => {
            onMoveEnd?.();
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