import {Box, Button, Typography} from "@mui/material";
import {buttonStyle} from "../../styles";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts";
import {useMobile} from "../../hook";
import {useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";

const WelcomePart = () => {

    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();
    const translate = useTranslate();
    const navigate = useNavigate();

    const backgroundImage = mode === 'dark' ? 'linear-gradient(to top, #5c8399 20%, #343487 80%)' : `linear-gradient(to top, #376a86 20%, #6565de 80%)`;

    const filter1 = 'invert(91%) sepia(63%) saturate(3433%) hue-rotate(246deg) brightness(103%) contrast(98%)';

    const filter2 = 'invert(100%) sepia(100%) saturate(1%) hue-rotate(226deg) brightness(104%) contrast(101%)';

    const filter3 = 'invert(100%) sepia(4%) saturate(7484%) hue-rotate(34deg) brightness(102%) contrast(103%)';

    return (
        <Box sx={{
            width: '100%',
            height: {xs: 'fit-content', sm: '415px', md: '470px'},
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Box sx={{
                position: 'relative',
                zIndex: 4,
                width: '100%',
                p: '20px',
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                justifyContent: 'space-evenly',
                gap: 2,
                alignItems: 'center'
            }}>
                {
                    width > 1100 && (
                        <Box sx={{
                            width: {xs: '250px', sm: '200px', md: '300px'},
                            height: {xs: '250px', sm: '200px', md: '300px'},
                            "& img": {
                                width: '100%',
                                height: '100%',
                                WebkitMaskImage: 'url("images/home/shape4.png")',
                                maskImage: 'url("images/home/shape4.png")',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                objectFit: 'cover',
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center',
                            }
                        }}>
                            <img src={'images/home/restaurant.png'} alt={'restaurantPicture'}/>
                        </Box>
                    )
                }
                <Box sx={{
                    height: 'fit-content',
                    maxWidth: {xs: '90%', sm: '60%', lg: '700px'},
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    gap: {xs: 2, md: 4},
                    color: '#fff'
                }}>
                    <Box sx={{
                        fontSize: {xs: '22px', sm: '28px', md: '32px'},
                        fontWeight: {xs: 600, md: 900}
                    }}>
                        <Box>{translate('text.home.searchPlace1')}</Box>
                        <Box sx={{
                            p: '5px 0',
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            width: 'fit-content'
                        }}>
                            <Box sx={{
                                background: 'linear-gradient(to right, #8095CF 0%, #00FF00 35%, #DEC76B 60%, #CF1512 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {translate('text.home.searchPlace2')}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        fontSize: {xs: '14px', sm: '16px'}
                    }}>
                        {translate('text.home.byPlace')}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography sx={{
                            width: '65%',
                            fontSize: {xs: '14px', sm: '16px'}
                        }}>
                            {translate('text.home.findYourSelf')}
                        </Typography>
                        <Button variant={'contained'}
                                onClick={() => navigate('/all_institutions')}
                                sx={{
                                    ...buttonStyle,
                                    bgcolor: mode === 'dark' ? 'common.black' : 'info.main',
                                    textTransform: 'capitalize',
                                    color: '#fff',
                                    width: '30%',
                                    "&:hover": {
                                        bgcolor: mode === 'dark' ? 'common.black' : 'info.main',
                                    }
                                }}
                        >
                            {translate('buttons.show')}
                        </Button>
                    </Box>
                </Box>
                <Box sx={{
                    width: {xs: '250px', sm: '200px', md: '300px'},
                    height: {xs: '250px', sm: '200px', md: '300px'},
                    "& img": {
                        width: '100%',
                        height: '100%',
                        WebkitMaskImage: 'url("images/home/shape.png")',
                        maskImage: 'url("images/home/shape.png")',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        objectFit: 'cover',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                    }
                }}>
                    <img src={'images/home/cafe.png'} alt={'cafePicture'}/>
                </Box>
            </Box>
            <Box className="waveWrapper waveAnimation">
                <Box className="waveWrapperInner bgTop"
                     sx={{
                         backgroundImage: backgroundImage
                     }}>
                    <Box className="wave waveTop"
                         sx={{
                             backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-top.png')",
                             filter: mode === 'dark' ? filter1 : 'unset'
                         }}></Box>
                </Box>
                <Box className="waveWrapperInner bgMiddle"
                     sx={{
                         backgroundImage: backgroundImage
                     }}
                >
                    <Box className="wave waveMiddle"
                         sx={{
                             backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-mid.png')",
                             filter: mode === 'dark' ? filter2 : 'unset'
                         }}></Box>
                </Box>
                <Box className="waveWrapperInner bgBottom"
                     sx={{
                         backgroundImage: backgroundImage
                     }}
                >
                    <Box className="wave waveBottom"
                         sx={{
                             backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-bot.png')",
                             filter: mode === 'dark' ? filter3 : 'unset'
                         }}></Box>
                </Box>
            </Box>
        </Box>
    );
};
export default WelcomePart
