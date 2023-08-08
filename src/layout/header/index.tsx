import React, {useContext, useEffect, useState} from "react";
import {
    useGetIdentity,
    useGetLocale,
    useSetLocale,
} from "@refinedev/core";
import {
    AppBar,
    IconButton,
    Avatar,
    Stack,
    FormControl,
    MenuItem,
    Select,
    Toolbar,
    Typography, SelectChangeEvent,
} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined, Notifications, SettingsOutlined} from "@mui/icons-material";

import {ColorModeContext} from "../../contexts";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {ProfileProps} from "../../interfaces/common";
import {useSchema} from "../../settings";

export const Header: React.FC = () => {
    const {mode, setMode} = useContext(ColorModeContext);

    const {i18n} = useTranslation();
    const {pathname} = useLocation();
    const changeLanguage = useSetLocale();
    const navigate = useNavigate();
    const locale = useGetLocale();
    const {borderRadiusS} = useSchema();
    const currentLocale = locale();

    const {data: user} = useGetIdentity<ProfileProps>();

    const showUserInfo = user && (user.name || user.avatar);
    const [lan, setLan] = useState<any>(currentLocale);
    const handleChange = (event: SelectChangeEvent) => {
        setLan(event.target.value as string);
    };
    useEffect(() => {
        if (lan) {
            changeLanguage(lan ?? currentLocale)
        }
    }, [lan, currentLocale])

    return (
        <AppBar position="sticky" elevation={0} sx={{
            zIndex: {xs: '10 !important'},
            borderRadius: borderRadiusS,
            bgcolor: (theme) => theme.palette.common.black
        }}>
            <Toolbar>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    {
                        showUserInfo &&
                        <IconButton onClick={() => navigate('/notifications')}>
                            <Notifications/>
                        </IconButton>
                    }
                    <IconButton
                        onClick={() => {
                            setMode();
                        }}
                    >
                        {mode === "dark" ? <LightModeOutlined color={"warning"}/> : <DarkModeOutlined/>}
                    </IconButton>
                    <FormControl sx={{m: 1, display: 'flex'}}>
                        <Select
                            disableUnderline
                            inputProps={{"aria-label": "Without label"}}
                            variant="standard"
                            sx={{
                                "& div div": {
                                    display: 'flex',
                                    alignItems: 'center'
                                }
                            }}
                            value={lan ?? currentLocale}
                            onChange={handleChange}
                        >
                            {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                                <MenuItem
                                    selected={currentLocale === lang}
                                    key={lang}
                                    value={lang ?? ""}
                                    sx={{
                                        display: 'flex',
                                    }}
                                >
                                    <Stack
                                        display={"flex"}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Avatar
                                            sx={{
                                                display: 'flex',
                                                width: "16px",
                                                height: "16px",
                                                marginRight: "5px",
                                            }}
                                            src={`/images/flags/${lang}.svg`}
                                        />
                                        <Typography component={"span"} sx={{
                                            display: {xs: "none", sm: 'flex'},
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            {lang === "ua" ? "UA" : "EN"}
                                        </Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {showUserInfo && (
                        <Stack direction="row" sx={{
                            p: '5px',
                        }} gap="16px" alignItems="center">
                            <Stack sx={{
                                cursor: 'pointer'
                            }} onClick={() => navigate('/profile')}>
                                {user.avatar
                                    && <Avatar src={user?.avatar} alt={user?.name}/>
                                }
                            </Stack>
                            <IconButton
                                sx={{
                                    bgcolor: pathname === '/settings' ? 'cornflowerblue' : 'transparent'
                                }}
                                onClick={() => navigate(`/settings`)}>
                                <SettingsOutlined/>
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
