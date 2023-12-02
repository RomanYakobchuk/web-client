import {Header} from "../../layout";
import {Avatar, Box, Button, Container, CssBaseline, Typography} from "@mui/material";
import React, {FC, useContext} from "react";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../contexts";
import {Link, useNavigate} from "react-router-dom";
import {buttonStyle} from "../../styles";
import ContainerComponent from "./utills/containerComponent";


const Welcome: FC = () => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const navigate = useNavigate();

    return (
        <ContainerComponent childrenProps={{
            maxWidth: '90%'
        }}>
            <Box
                sx={{
                    marginTop: {xs: 3, md: 8},
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: "start",
                    flexDirection: {xs: "column", md: 'row'},
                    alignItems: 'start',
                    gap: {xs: 2, md: 10},
                    flexWrap: 'wrap',
                }}>
                    <Typography sx={{
                        fontSize: {xs: 30, md: 40},
                        fontWeight: 400
                    }}>
                        {translate("welcomePage.title")}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: "center",
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Avatar src={'./favicon.ico'}/>
                        <Typography sx={{
                            fontSize: {xs: 30, md: 40},
                            fontWeight: 700
                        }}>
                            Capl
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{
                    mt: {xs: 3, md: 10}
                }}>
                    <Typography sx={{
                        fontSize: {xs: 16, md: 20},
                        maxWidth: {xs: '90%', sm: "70%"},

                    }}>
                        {translate("welcomePage.text")}
                    </Typography>
                </Box>
                <Box sx={{
                    mt: {xs: 3, md: 8},
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    gap: {xs: 2, sm: 4},
                    alignItems: {xs: 'start', sm: 'end'},
                    "& a":{
                        fontSize: {xs: 16, sm: 18, md: 20}
                    }
                }}>
                    <Typography sx={{
                        fontSize: {xs: 16, sm: 18, md: 20},
                        maxWidth: {xs: '90%', sm: "70%"},
                    }}>
                        {translate("welcomePage.text2")}
                    </Typography>
                    <Link
                        to={'/register'}
                        style={{

                        }}
                    >
                        {translate("pages.login.signup")}
                    </Link>
                    {/*<Button onClick={() => navigate('/register')}*/}
                    {/*        color={mode === "dark" ? "info" : "secondary"} variant={"contained"}*/}
                    {/*        sx={{*/}
                    {/*            ...buttonStyle,*/}
                    {/*            padding: '5px 10px',*/}
                    {/*            height: {xs: '40px', md: '60px'},*/}
                    {/*            width: '300px',*/}
                    {/*        }}>*/}
                    {/*</Button>*/}
                </Box>
                <Box sx={{
                    mt: 6,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'end',
                    "& a":{
                        fontSize: {xs: 16, sm: 18, md: 20}
                    }
                }}>
                    <Typography sx={{
                        fontSize: {xs: 16, sm: 18, md: 20},
                        // maxWidth: "70%",
                    }}>
                        {translate("welcomePage.question")}
                    </Typography>
                    <Link
                        to={'/login'}
                        style={{

                            }}
                    >
                        {translate("pages.login.signin")}
                    </Link>
                </Box>
            </Box>
        </ContainerComponent>
    );
};

export default Welcome;