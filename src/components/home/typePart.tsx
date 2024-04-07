import {Box, Paper} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import CountType from "./countType";

const TypePart = () => {
    const translate = useTranslate();

    return (
        <Box
            sx={{
                width: {xs: '90vw', md: '90%'},
                margin: '0 auto',
                height: {xs: 'fit-content',},
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box sx={{
                display: 'flex',
                textAlign: 'start',
                fontWeight: {xs: 600, md: 700},
                fontSize: {xs: '18px', sm: '22px', lg: '24px'},
                pl: 2,
                borderLeft: '3px solid transparent',
                borderLeftColor: 'common.white',
            }}>
                {translate("home.sortByType.browseByType")}
            </Box>
            <Box sx={{
               width: '100%',
                // clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)',
                // background: bg,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                justifyContent: 'space-evenly',
                alignItems: 'center',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', lg: 'row'},
                    gap: {xs: 2, md: 3},
                    width: '100%'
                }}>
                    <Box sx={{
                        // width: {xs: '90%'},
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        color: 'common.white',
                        p: '20px',
                        gap: {xs: 2, sm: 4},
                        alignItems: 'center',
                        borderRadius: '15px',
                        bgcolor: 'modern.modern_1.main',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            gap: {sm: 4, md: 0},
                            alignItems: 'center',
                            width: {xs: '100%', lg: '80%'}
                        }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    width: '100%',
                                    minWidth: {xs: '100%', sm: '200px', md: '260px'},
                                    height: {xs: '220px', md: '240px', lg: '260px'},
                                    borderRadius: '7px',
                                }}>
                                <img
                                    style={{
                                        borderRadius: '7px',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    alt={'type_image'}
                                    loading={"lazy"}
                                    src={`images/restaurant.jpg`}
                                />
                            </Paper>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%'
                        }}>
                            <Box sx={{
                                textAlign: 'start',
                                fontSize: {xs: '14px', sm: '16px', lg: '20px', sl: '22px'},
                                whiteSpace: 'pre-wrap'
                            }}>
                                {translate('text.home.byType')}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        minWidth: '260px',
                        display: 'contents'
                    }}>
                        <CountType/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default TypePart
