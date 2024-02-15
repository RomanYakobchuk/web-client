import {Box, Button} from "@mui/material";
import {FullscreenExit, FullscreenRounded} from "@mui/icons-material";

export const ScreenMode = () => {
    const handleFullScreen = async () => {
        if (!document.fullscreen || window.innerWidth !== window.screen.width) {
            await document?.querySelector("#root")?.requestFullscreen();
        }
    }
    const handleNormalScreen = async () => {
        if (document.fullscreen || window.innerWidth === window.screen.width) {
            await document.exitFullscreen();
        }
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: {xs: 'column', sm: 'row'},
            "& div#fullScreenModeDiv": {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'start',
                "& button": {
                    textTransform: 'inherit'
                }
            },
            bgcclor: 'modern.modern_2.main',
            p: 2,
            borderRadius: '10px',
            gap: 2,

        }}>
            <Box
                id={'fullScreenModeDiv'}
            >
                <Button
                    variant={'contained'}
                    color={'info'}
                    onClick={handleFullScreen}
                    startIcon={<FullscreenRounded/>}
                >
                    Full screen mode
                </Button>
            </Box>
            <Box
                id={'fullScreenModeDiv'}
            >
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={handleNormalScreen}
                    startIcon={<FullscreenExit/>}
                >
                    Normal screen mode
                </Button>
            </Box>
        </Box>
    );
};

