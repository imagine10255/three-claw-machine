import {IWallProps} from './types';
import Wall from './Wall';


/**
 * 娃娃機壁
 */
const Walls = () => {
    const wallProps: IWallProps[] = [
        {
            // 后壁 - 改为墙壁壁纸
            position: [0, 0, 10],
            args: [20, 12, 0.5],
        },
        {
            // 前壁 - 保持玻璃
            position: [0, 0, -10],
            args: [20, 12, 0.5],
            isBack: true,
        },
        {
            // 右壁 - 保持玻璃
            position: [10, 7, 0],
            args: [0.5, 12, 20]
        },
        {
            // 左壁 - 保持玻璃
            position: [-10, 0, 0],
            args: [0.5, 12, 20]
        }
    ]

    ;

    return (
        <>
            {wallProps.map((props, i) => {
                return <Wall key={i}
                    position={
                        [
                            props.position[0],
                            props.args[1] / 2,
                            props.position[2]
                        ]
                    }
                    args={props.args}
                    isBack={props.isBack}
                />;
            })}
        </>
    );
};


export default Walls;
