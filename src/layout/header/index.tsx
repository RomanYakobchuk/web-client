import React, {useContext, useEffect, useState} from "react";
import {
    useGetLocale,
    useSetLocale, useTranslate,
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
    Typography, SelectChangeEvent, Button, Box
} from "@mui/material";
import {
    DarkModeOutlined,
    LightModeOutlined, MenuRounded,
    Notifications,
    SearchOutlined,
    SettingsOutlined
} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {Badge} from "antd"

import {ColorModeContext} from "@/contexts";
import {useSchema} from "@/settings";
import {useMobile, useUserInfo, useUserProperties} from "@/hook";
import {SchemaContext} from "@/settings/schema";
import HeaderSearch from "./headerSearch";

export const Header: React.FC = () => {
    const {mode, setMode, setOpen} = useContext(ColorModeContext);
    const {properties} = useUserProperties();

    const {schema} = useContext(SchemaContext)

    const {user} = useUserInfo();
    const {i18n} = useTranslation();
    const {pathname} = useLocation();
    const changeLanguage = useSetLocale();
    const translate = useTranslate();
    const navigate = useNavigate();
    const locale = useGetLocale();
    const {styles} = useSchema();
    const {width} = useMobile();
    const currentLocale = locale();


    const showUserInfo = user && (user.name || user.avatar || user._id);
    const [lan, setLan] = useState<any>(currentLocale);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleChange = (event: SelectChangeEvent) => {
        setLan(event.target.value as string);
    };
    useEffect(() => {
        if (lan) {
            changeLanguage(lan ?? currentLocale)
        }
    }, [lan, currentLocale]);

    const buttonStyle = {
        border: '1px solid silver',
        borderRadius: '10px',
        "@media screen and (max-width: 600px)": {
            width: '32px',
            minWidth: '32px',
            height: '32px',
        },
        width: '40px',
        minWidth: '40px',
        height: '40px',
    };

    const bgColor = schema === 'schema_2' ? 'common.black' : mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'


    const HandleOpenModal = () => {
        setOpenModal(true)
    }

    return (
        <AppBar elevation={0} sx={{
            position: 'sticky',
            zIndex: '8',
            top: 0,
            borderRadius: styles.borderRadiusS,
            bgcolor: bgColor,
            // width: widthAppBar,
            backdropFilter: schema === 'schema_1' ? 'blur(20px)' : 'unset',
            transition:
                "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            borderBottom: schema === 'schema_1' ? '1px solid silver' : ''
        }}>
            <Toolbar sx={{
                pl: '0 !important'
            }}>
                {
                    showUserInfo && (
                        <Box
                            sx={{
                                display: {xs: "block", md: "none"},
                                borderRadius: styles.buttonSiderS.borderRadius,
                                bgcolor: "#475be8",
                                zIndex: 9,
                                ml: styles.buttonSiderS.left,
                                width: "36px",
                            }}
                        >
                            <IconButton
                                sx={{color: "#fff", width: "36px"}}
                                onClick={setOpen}
                            >
                                <MenuRounded/>
                            </IconButton>
                        </Box>
                    )
                }
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={1}
                >
                    {
                        showUserInfo && (
                            <Button
                                variant={"outlined"}
                                sx={{
                                    ...buttonStyle,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '120px',
                                    // "@media screen and (min-width: 0px && max-width: 500px)":{
                                    //     width: '32px'
                                    // },
                                    // "@media screen and (max-width: 600px)":{
                                    //     width: '40px'
                                    // },
                                    gap: {xs: 0, sm: 1},
                                    p: '5px',
                                    transition: 'width 1s linear'
                                }}
                                onClick={() => {
                                    HandleOpenModal()
                                }}
                                color={'secondary'}
                            >
                                <SearchOutlined color={'action'}/>
                                {
                                    width > 600 && (
                                        <Typography sx={{
                                            textTransform: 'capitalize',
                                            display: {xs: 'none', sm: 'flex'}
                                        }}>
                                            {translate('buttons.search')}...
                                        </Typography>
                                    )
                                }
                            </Button>
                        )
                    }
                    {
                        openModal && (
                            <HeaderSearch openModal={openModal} setOpenModal={setOpenModal}/>
                        )
                    }
                    {
                        showUserInfo &&
                        <IconButton
                            sx={{
                                ...buttonStyle
                            }}
                            onClick={() => navigate('/notifications')}>
                            <Badge
                                count={properties?.notReadNotifications || 0}
                                // color={'info'}
                                // badgeContent={properties?.notReadNotifications || 0}
                            >
                                <Notifications color={'secondary'}/>
                            </Badge>
                        </IconButton>
                    }
                    <IconButton
                        sx={{
                            ...buttonStyle,
                        }}
                        onClick={() => {
                            setMode();
                        }}
                    >
                        {mode === "dark" ? <LightModeOutlined color={"warning"}/> : <DarkModeOutlined/>}
                    </IconButton>
                    <FormControl sx={{display: 'flex'}}>
                        <Select
                            disableUnderline
                            inputProps={{"aria-label": "Without label"}}
                            variant="standard"
                            sx={{
                                ...buttonStyle,
                                "& div": {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 3px'
                                },
                                width: 'fit-content !important',
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
                        <Stack direction="row" gap="16px" alignItems="center">
                            <Stack sx={{
                                cursor: 'pointer',
                                ...buttonStyle,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} onClick={() => navigate('/profile')}>
                                {user.avatar
                                    && <Avatar sx={{
                                        width: '80%',
                                        height: '80%'
                                    }} src={user?.avatar} alt={user?.name}/>
                                }
                            </Stack>
                        </Stack>
                    )}
                    {
                        showUserInfo && (
                            <IconButton
                                sx={{
                                    ...buttonStyle,
                                    bgcolor: pathname === '/settings' ? 'cornflowerblue' : 'transparent'
                                }}
                                onClick={() => navigate(`/settings`)}>
                                <SettingsOutlined/>
                            </IconButton>
                        )
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
