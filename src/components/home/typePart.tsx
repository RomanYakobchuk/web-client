import {Box, Paper} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {useContext} from "react";
import {ColorModeContext} from "@/contexts";
import CountType from "./countType";

const TypePart = () => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    // const bg = mode === 'dark' ? 'linear-gradient(180deg, rgb(25 22 89) 20%, rgb(71 60 109) 80%)' : 'linear-gradient(180deg, rgba(115,109,219,1) 20%, rgba(75,46,179,1) 80%)'

    return (
        <Box sx={{
            width: {xs: '90vw', md: '90%'},
            margin: '0 auto',
            height: {xs: 'fit-content',},
            // clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)',
            // background: bg,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            gap: 4,
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
                    flexDirection: {xs: 'column', md: 'row'},
                    color: 'common.white',
                    p: '20px',
                    gap: {xs: 2, md: 3},
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
                                width: {xs: '100%', sm: '200px', md: '100%'},
                                minWidth: {xs: '100%', sm: '200px', md: '260px'},
                                height: {xs: '180px', sm: '140px', md: '180px', lg: '220px'},
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
                        <Box sx={{
                            display: {xs: 'none', sm: 'flex', md: 'none'},
                            textAlign: 'start',
                            fontWeight: {xs: 600, md: 700},
                            fontSize: {sm: '30px',},
                            whiteSpace: 'pre-wrap'
                        }}>
                            {translate("home.sortByType.browseByType")}
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%'
                    }}>
                        <Box sx={{
                            display: {sm: 'none', md: 'flex'},
                            textAlign: 'start',
                            fontWeight: {xs: 600, md: 700},
                            fontSize: {xs: '18px', sm: '20px', md: '24px', lg: '30px', xl: '34px'}
                        }}>
                            {translate("home.sortByType.browseByType")}
                        </Box>
                        <Box sx={{
                            textAlign: 'start',
                            fontSize: {xs: '14px', sm: '16px', xl: '18px'},
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
    );
};
export default TypePart
