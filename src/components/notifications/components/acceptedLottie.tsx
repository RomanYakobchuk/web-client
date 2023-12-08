import {Box, SxProps} from "@mui/material";

import Congratulation from "@/lotties/congratulation.json"
import Success from "@/lotties/success.json"
import LottieComponent from "@/lotties/LottieComponent";

type TProps = {
    style?: SxProps,
    isClickToStartAnimation?: boolean
}
const AcceptedLottie = ({style, isClickToStartAnimation = false}: TProps) => {

    return (
        <Box sx={{
            margin: '20px auto',
            position: 'relative',
            width: '175px',
            height: '175px',
            ...style
        }}>
            <LottieComponent
                style={{
                    margin: 0,
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1
                }}
                isClickToStartAnimation={isClickToStartAnimation}
                item={Success}
                size={175}
            />
            <LottieComponent
                style={{
                    margin: 0,
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-200%, -200%)'
                }}
                isClickToStartAnimation={isClickToStartAnimation}
                item={Congratulation}
                size={350}
                loop={true}
            />
        </Box>
    );
};
export default AcceptedLottie
