import {Box, Typography} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {useContext} from "react";
import {ColorModeContext} from "../../contexts";
import CountType from "./countType";

const TypePart = () => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const bg = mode === 'dark' ? 'linear-gradient(180deg, rgb(25 22 89) 20%, rgb(71 60 109) 80%)' : 'linear-gradient(180deg, rgba(115,109,219,1) 20%, rgba(75,46,179,1) 80%)'

    return (
        <Box sx={{
            width: '100%',
            height: {xs: 'fit-content',},
            clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)',
            background: bg,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            gap: 4,
            alignItems: 'center',
            p: '80px 0'
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                p: '10px',
                bgcolor: 'rgba(0, 0, 0, 0.2)'
            }}>
                <Typography sx={{
                    fontSize: {xs: '18px', sm: '24px', md: '30px'},
                    fontWeight: 900,
                    background: 'linear-gradient(to right, #e0e94c 0%, #f1805c 35%, #cf4bb8 60%, #87d765 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {translate("home.sortByType.browseByType")}
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                gap: {xs: 2, md: 3},
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    maxWidth: '800px',
                    width: {xs: '90%', md: '40%'},
                    display: 'flex',
                    flexDirection: 'column',
                    p: '0 20px',
                    gap: {xs: 2, md: 3},
                }}>
                    <Box sx={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: {xs: '14px', sm: '16px', lg: '18px'}
                    }}>
                        {translate('text.home.byType')}
                    </Box>
                </Box>
                <Box sx={{
                    width: {xs: '90%', md: '60%'},
                    p: '20px 40px 0px 40px'
                }}>
                    <CountType/>
                </Box>
            </Box>
        </Box>
    );
};
export default TypePart
