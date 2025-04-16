import Plane from './Plane';
import {IPlaneProps} from './types';

const color = '#c2cd4b';

/**
 * Plane
 */
const Planes = () => {
    const planProps: IPlaneProps[] = [
        {
            // 長塊
            position: [0, 0, -2.5],
            args: [20, .2, 15],
            color,
        },
        {
            // 尾壁
            position: [2.5, 0, 7.5],
            args: [15, .2, 5],
            color,
        },
        {
            // 圍牆
            position: [-7.5, -5, 5],
            args: [5, 3, .2],
            color,
        },
        {
            // 圍牆
            position: [-5, -5, 7.5],
            args: [.2, 3, 5],
            color,
        },
    ]

    ;

    return (
        <>
            {planProps.map((props, i) => {
                return <Plane key={i}
                    position={
                        [
                            props.position[0],
                            props.args[1] / 2,
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

