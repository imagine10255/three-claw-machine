interface IProps {
    onMove: (direction: string) => void
    onGrab: () => void
    isGrabbing: boolean
}

/**
 * 控制面板
 * @param onMove
 * @param onGrab
 * @param isGrabbing
 * @constructor
 */
const ControlPanel = ({
    onMove,
    onGrab,
    isGrabbing
}: IProps) => {

    return (
        <div className="controls">
            <div className="d-pad">
                <button onClick={() => onMove('forward')}>前</button>
                <button onClick={() => onMove('backward')}>后</button>
                <button onClick={() => onMove('left')}>左</button>
                <button onClick={() => onMove('right')}>右</button>
            </div>
            <button className="grab-btn" onClick={onGrab}>
                {isGrabbing ? '松开' : '抓取'}
            </button>
        </div>
    );
};

export default ControlPanel;
