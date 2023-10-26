import {Box} from "@mui/material";
import { GoogleAuth} from "../../../components";
import React from "react";
import {useTranslate} from "@refinedev/core";
import {FacebookAuth, GithubAuth} from "../../../auth";

type IProps = {
    googleType: "login" | "register",
    googleText?: "signin_with" | "signup_with" | "continue_with" | undefined,
    facebookType: "login" | "register",
    githubType: "login_github" | "register_github",
    facebookText?: "signin_with" | "signup_with" | "continue_with" | undefined,
}

const OrPart = ({googleType, googleText, facebookType, facebookText, githubType}: IProps) => {
    const translate = useTranslate();
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
            margin: '20px auto'
        }}>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    "&::after, &::before": {
                        content: "''",
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '45%',
                        height: '1px',
                        bgcolor: 'silver',
                    },
                    "&::after": {
                        right: 0
                    },
                    "&::before": {
                        left: 0
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: '5px',
                    borderRadius: '50%',
                    fontSize: '16px',
                    width: '10%',
                    aspectRatio: '1 / 1'
                }}>
                    {translate('pages.login.divider')}
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'row', sm: 'column'},
                gap: 2,
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center'
            }}>
                <GoogleAuth type={googleType} text={googleText}/>
                <FacebookAuth type={facebookType} text={facebookText}/>
                {/*<GithubAuth type={githubType}/>*/}
            </Box>
        </Box>
    );
};
export default OrPart
