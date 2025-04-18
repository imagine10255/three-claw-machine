import Plane from './Plane';
import {IPlaneProps} from './types';

const color = '#c2cd4b';

/**
 * Plane
 */
const Planes = () => {
    const ceiling: IPlaneProps[] = [
        // {
        //     // 底版長塊
        //     position: [0, 12, 0],
        //     args: [20, .2, 20],
        //     color,
        // },
    ];
    const planProps: IPlaneProps[] = [
        {
            // 底版長塊
            position: [0, 0, -2.5],
            args: [20, .2, 15],
            color,
        },
        {
            // 底版尾壁
            position: [2.5, 0, 7.5],
            args: [15, .2, 5],
            color,
        },
    ];

    const holdProps: IPlaneProps[] = [
        {
            // 圍牆
            position: [-7.5, -2, 5],
            args: [5, 10, .2],
            color,
            isBottom: false,
        },
        {
            // 圍牆
            position: [-5, -2, 7.5],
            args: [.2, 10, 5],
            color,
            isBottom: false,
        },
    ];

    const bodyProps: IPlaneProps[] = [
        {
            // 后壁 - 改为墙壁壁纸
            position: [0, 0, 10],
            args: [20, 12, 0.5],
            color,
        },
        {
            // 前壁 - 保持玻璃
            position: [0, 0, -10],
            args: [20, 12, 0.5],
            color,
        },
        {
            // 右壁 - 保持玻璃
            position: [10, 7, 0],
            args: [0.5, 12, 20],
            color,
        },
        {
            // 左壁 - 保持玻璃
            position: [-10, 0, 0],
            args: [0.5, 12, 20],
            color,
        }
    ];

    return (
        <>
            {ceiling.map((props, i) => {
                return <Plane key={i}
                    position={
                        [
                            props.position[0],
                            props.position[1],
                            props.position[2]
                        ]
                    }
                    args={props.args}
                    color="green"
                />;
            })}

            {planProps.map((props, i) => {
                return <Plane key={i}
                    position={
                        [
                            props.position[0],
                            props.isBottom ? props.args[1] / 2: props.position[1],
                            props.position[2]
                        ]
                    }
                    args={props.args}
                    color={props.color}
                />;
            })}


            {holdProps.map((props, i) => {
                return <Plane key={i}
                    position={
                        [
                            props.position[0],
                            props.position[1],
                            props.position[2]
                        ]
                    }
                    args={props.args}
                    color={props.color}
                />;
            })}


            {bodyProps.map((props, i) => {
                return <Plane key={i}
                    position={
                        [
                            props.position[0],
                            props.args[1] / - 2,
                            props.position[2]
                        ]
                    }
                    args={props.args}
                    color={props.color}
                />;
            })}
        </>
    );
};


export default Planes;

