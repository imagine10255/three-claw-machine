
// 控制面板
function ControlPanel({onMove, onGrab, isGrabbing}: {onMove: (direction: string) => void, onGrab: () => void, isGrabbing: boolean}) {
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
}

export default ControlPanel;
