import DemoCubeHeap from '@/views/DemoCubeHeap';
import Pingpong from '@/views/Pingpong';

import ClawMachine, {IApi, TTargetIndex} from './ClawMachine';


export default function App() {
    return <div style={{width: '100vw', height: '100vh'}}>
        <ClawMachine/>
        {/*<DemoCubeHeap/>*/}
        {/*<Pingpong/>*/}
    </div>;
}
