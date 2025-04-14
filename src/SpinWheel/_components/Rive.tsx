import {useRive} from '@rive-app/react-canvas';
import styled from 'styled-components';

interface IProps {
    handleOnSpin: () => void,
    handleOnPressed: () => void,
}

const Rive = ({
    handleOnSpin,
    handleOnPressed,
}: IProps) => {
    const {RiveComponent} = useRive({
        src: '/rive/spinButton.riv',
        stateMachines: 'Spin',
        autoplay: true,
        onStateChange: (e) => {
            const data = e.data;
            if(Array.isArray(data) && data.includes('hover')){
                console.log('hover');
            }


            if(Array.isArray(data) && data.includes('pressed')){
                handleOnPressed();
            }

            // 判斷 data === ['spin']
            if(Array.isArray(data) && data.length === 1 && data[0] === 'spin'){
                handleOnSpin();
            }
        }
    });

    return (
        <RiveContainer>
            <RiveComponent />
        </RiveContainer>
    );
};

export default Rive;


const RiveContainer = styled.div`
    width: 40%;
    height: 40%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
`;