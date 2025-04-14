import {motion} from 'framer-motion-3d';

import {IMergeRow, TTargetIndex} from '../types.ts';
import {animateConfig} from '../config.ts';

import Prize2 from './Prize2.tsx';
import Wheel from './Wheel.tsx';



// 圈數 預設兩圈
const round = Math.PI * -2;

interface IProps {
    isRotate: boolean,
    targetIndex: TTargetIndex,
    times?: number,
    data: IMergeRow[],
}


function Group ({
    isRotate,
    targetIndex,
    times = 2,
    data,
}: IProps) {

    // 旋轉角度 = 旋轉圈數 + 指定角度
    const rotateZ = (round * times) - (round * targetIndex / data.length);

    // 動畫順序
    const animate = [
        {
            z: isRotate ? 0.5 : 0,
            transition: {
                type: "spring", // 彈簧效果
                duration: animateConfig.zoomInDuration,
            }
        },
        {
            rotateZ: isRotate ? rotateZ : 0,
            transition: {
                type: "spring",
                duration: animateConfig.rotateDuration,
                delay: animateConfig.rotateDelay,
            }
        },
        {
            scale: isRotate ? 0.9 : 1,
            transition: {
                type: "spring",
                delay: animateConfig.zoomOutDelay,
            },
        },

    ];



    /**
     * 渲染 獎品區塊
     * @return Prize
     */
    const renderPrize = () => {
        return data.map((row, index) => {
            const {x, y} = row.position
            return (
                <Prize2
                    key={row.id}
                    x={x}
                    y={y}
                    prizeUrl={row.prizeUrl}
                    isRotate={isRotate}
                    isActive={targetIndex === index}
                    text={index.toString()}
                />
            )
        })
    }

    return (
        <motion.group
            animate={animate}
        >
            <Wheel/>
            {renderPrize()}
        </motion.group>
    )
}

export default Group;



