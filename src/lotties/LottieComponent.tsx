import {Box, SxProps} from "@mui/material";
import Lottie, {Options, LottieProps} from "react-lottie";

type TProps = {
    item: object,
    size?: number,
    style?: SxProps,
    loop?: boolean,
    isClickToStartAnimation?: boolean
}
const LottieComponent = ({item, size = 150, style, loop = false, isClickToStartAnimation = false}: TProps) => {
    const defaultOptions: Options = {
        loop: loop,
        autoplay: !isClickToStartAnimation,
        animationData: item,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <Box sx={{
            margin: '20px auto',
            ...style
        }}>
            <Lottie
                isClickToPauseDisabled={isClickToStartAnimation}
                options={defaultOptions}
                width={size}
                height={size}
            />
        </Box>
    );
};
export default LottieComponent
