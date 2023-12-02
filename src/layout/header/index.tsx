import React, {useContext, useEffect, useState} from "react";
import {
    useGetLocale, useList,
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
    Badge,
    Typography, SelectChangeEvent, Button, Box
} from "@mui/material";
import {
    ClearOutlined,
    DarkModeOutlined,
    LightModeOutlined, MenuRounded,
    Notifications,
    SearchOutlined,
    SettingsOutlined
} from "@mui/icons-material";
import {useDebounce} from "use-debounce";
import {Input} from "antd";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";

import {ColorModeContext} from "@/contexts";
import {INews, IOptions, PropertyProps} from "@/interfaces/common";
import {useSchema} from "@/settings";
import {useMobile, useUserInfo, useUserProperties} from "@/hook";
import {Loading, ModalWindow} from "@/components";
import {renderTitle, renderItem} from "@/components/render"
import {antdInputStyle} from "@/styles";
import {SchemaContext} from "@/settings/schema";

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
        "@media screen and (max-width: 500px)": {
            width: '32px',
            minWidth: '32px',
            height: '32px',
        },
        width: '40px',
        minWidth: '40px',
        height: '40px',
    };
    const [value, setValue] = useState<string>("");
    const [options, setOptions] = useState<IOptions[]>([]);
    const [debounceValue, _] = useDebounce(value ?? '', 500);

    const {refetch: refetchPlaces, isRefetching: isRefetchPlace, isLoading: isLoadPlace} = useList<PropertyProps>({
        resource: "institution/all",
        filters: [{field: "title", operator: "contains", value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const postOptionGroup = data.data.map((item, index) =>
                    renderItem(item, "all_institutions", index, mode, setOpenModal, data.data.length, translate),
                );
                if (postOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(translate("all_institutions.all_institutions"), mode),
                            options: postOptionGroup,
                        },
                    ] as IOptions[]);
                }
            },
        },
    });

    const {refetch: refetchNews, isRefetching: isRefetchNews, isLoading: isLoadNews} = useList<INews>({
        resource: "news/all",
        filters: [{field: "title", operator: "contains", value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const categoryOptionGroup = data.data.map((item, index) =>
                    renderItem(item, "news", index, mode, setOpenModal, data.data.length),
                );
                if (categoryOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(translate("news.news"), mode),
                            options: categoryOptionGroup,
                        },
                    ] as IOptions[]);
                }
            },
        },
    });

    useEffect(() => {
        if (openModal && user?._id) {
            (async () => {
                setOptions([]);
                await Promise.all([refetchNews(), refetchPlaces()])
            })()
        }
    }, [debounceValue, openModal, user]);

    const bgColor = schema === 'schema_2' ? 'common.black' : mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'

    const isLoading = isLoadNews || isLoadPlace || isRefetchNews || isRefetchPlace;

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
                    <ModalWindow
                        open={openModal}
                        setOpen={setOpenModal}
                        title={
                            <Box sx={{
                                width: '80%',
                                ml: '20px',
                                ...antdInputStyle
                            }}>
                                <Input
                                    style={{
                                        width: '100%',
                                        fontSize: '20px',
                                        gap: 2,
                                        color: mode === 'dark' ? 'white' : 'black',
                                        background: 'transparent',
                                    }}
                                    value={value ?? ''}
                                    onChange={(e) => setValue(e.target.value)}
                                    suffix={
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: value?.length > 0 ? 1 : 0
                                        }}>
                                            <SearchOutlined/>
                                            {
                                                value?.length > 0 && (
                                                    <IconButton size={"small"} onClick={() => setValue('')}>
                                                        <ClearOutlined/>
                                                    </IconButton>
                                                )
                                            }
                                        </Box>
                                    }
                                    size={'middle'}
                                    placeholder={`${translate('buttons.search')}...`}
                                />
                            </Box>
                        }
                    >
                        <Box sx={{
                            p: '10px'
                        }}>
                            {
                                isLoading ?
                                    <Box sx={{
                                        width: '100%',
                                        height: '200px'
                                    }}>
                                        <Loading/>
                                    </Box>
                                    :
                                    options?.length > 0 ? (
                                        options?.map((option, index) => (
                                            <Box key={index} sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}>
                                                {option.label}
                                                {
                                                    option?.options?.map((item) => (
                                                        <Box key={item.key} sx={{
                                                            pl: '10px',
                                                            height: '70px'
                                                        }}>
                                                            {item.label}
                                                        </Box>
                                                    ))
                                                }
                                            </Box>
                                        ))
                                    ) : <Box sx={{
                                        height: '150px',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '22px',
                                        color: (theme) => theme.palette.common.white
                                    }}>
                                        {translate('text.notResult')}
                                    </Box>
                            }
                        </Box>
                    </ModalWindow>
                    {
                        showUserInfo &&
                        <IconButton
                            sx={{
                                ...buttonStyle
                            }}
                            onClick={() => navigate('/notifications')}>
                            <Badge
                                color={'info'}
                                badgeContent={properties?.notReadNotifications || 0}
                            >
                                <Notifications/>
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
