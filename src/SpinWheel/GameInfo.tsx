
// 游戏信息
function GameInfo({dolls, caught}: {dolls: number, caught: number}) {
    return (
        <div className="game-info">
            <p>剩余娃娃: {dolls}</p>
            <p>已抓取: {caught}</p>
        </div>
    )
}


export default GameInfo;
