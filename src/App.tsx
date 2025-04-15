import ClawMachine, {IApi, TTargetIndex} from './ClawMachine';


const input: IApi[] = [
    {
        prizeUrl: './images/prize.png',
        id: '1',
    },
    {
        prizeUrl: './images/prize.png',
        id: '2',
    },
    {
        prizeUrl: './images/prize.png',
        id: '3',
    },
    {
        prizeUrl: './images/prize.png',
        id: '4',
    },
    {
        prizeUrl: './images/prize.png',
        id: '5',
    },
    {
        prizeUrl: './images/prize.png',
        id: '6',
    },
    {
        prizeUrl: './images/prize.png',
        id: '7',
    },
    {
        prizeUrl: './images/prize.png',
        id: '8',
    },
]; // API 傳入資料
const target: TTargetIndex = 1; // 目標
const times = 1; // 圈數

export default function App() {
    return <ClawMachine data={input} target={target} times={times}/>;
}
