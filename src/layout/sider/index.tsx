import React, {useContext, useEffect, useState} from "react";
import {Sider as DefaultSider} from "@refinedev/mui";

import {
    Box,
    Drawer,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Tooltip,
    Button,
    IconButton,
    StyledEngineProvider,
} from "@mui/material";

import {List as MuiList} from "@mui/material";
import {
    ListOutlined,
    Logout,
    ExpandLess,
    ExpandMore,
    ChevronLeft,
    ChevronRight,
    MenuRounded,
    CheckOutlined, CloseOutlined,
} from "@mui/icons-material";
import {
    CanAccess,
    ITreeMenu,
    useIsExistAuthentication,
    useLogout,
    useTitle,
    useTranslate,
    useMenu,
    useLink,
} from "@refinedev/core";

import {Title as DefaultTitle} from "../title";
import {useSchema} from "../../settings";
import {ColorModeContext} from "../../contexts";
import {ModalWindow} from "../../components";

export const Sider: typeof DefaultSider = ({render}) => {

    const {open: openSider, setOpen: setOpenSider, collapsed, setCollapsed} = useContext(ColorModeContext);

    const drawerWidth = () => {
        if (collapsed) return 64;
        return 200;
    };

    const t = useTranslate();
    const Link = useLink();

    const {menuItems, selectedKey, defaultOpenKeys} = useMenu();
    const isExistAuthentication = useIsExistAuthentication();
    const {mutate: mutateLogout} = useLogout();
    const Title = useTitle();
    const {styles} = useSchema();

    const [open, setOpen] = useState<{ [k: string]: any }>({});
    const [isLogOut, setIsLogOut] = useState(false)
    const [path, setPath] = useState<any>();

    useEffect(() => {
        if (window.location.pathname) {
            const myPath = window.location.pathname?.split('/')[1];
            setPath(`/${myPath}`)
        }
    }, [window.location.pathname]);
    useEffect(() => {
        setOpen((previousOpen) => {
            const previousOpenKeys: string[] = Object.keys(previousOpen);
            const uniqueKeys = new Set([
                ...previousOpenKeys,
                ...defaultOpenKeys,
            ]);
            const uniqueKeyRecord = Object.fromEntries(
                Array.from(uniqueKeys.values()).map((key) => [key, true]),
            );
            return uniqueKeyRecord;
        });
    }, [defaultOpenKeys]);

    const RenderToTitle = Title ?? DefaultTitle;

    const handleClick = (key: string) => {
        setOpen({...open, [key]: !open[key]});
    };

    const renderTreeView = (tree: ITreeMenu[], selectedKey: string) => {
        return tree.map((item: ITreeMenu) => {
            const {name, children, meta: {icon, label, parent: parentName}, route}: any = item;
            const isOpen = open[name || ""] || false;
            const isSelected = route === path;
            const isNested = !(parentName === undefined);

            if (children.length > 0) {
                return (
                    <CanAccess
                        key={name}
                        resource={name.toLowerCase()}
                        action="list"
                        params={{
                            resource: item,
                        }}
                    >
                        <div key={name}>
                            <Tooltip
                                title={t(`${name}.${name}`)}
                                placement="right"
                                disableHoverListener={!collapsed}
                                arrow
                            >
                                <ListItemButton
                                    onClick={() => {
                                        if (collapsed) {
                                            setCollapsed();
                                            if (!isOpen) {
                                                handleClick(name || "");
                                            }
                                        } else {
                                            handleClick(name || "");
                                        }
                                    }}
                                    sx={{
                                        pl: isNested ? 4 : 2,
                                        justifyContent: "center",
                                        "&.Mui-selected": {
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                            },
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            justifyContent: "center",
                                            minWidth: 36,
                                            color: "primary.contrastText",
                                        }}
                                    >
                                        {icon ?? <ListOutlined/>}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t(`${name}.${name}`)}
                                        primaryTypographyProps={{
                                            noWrap: true,
                                            fontSize: "16px",
                                            fontWeight: isSelected
                                                ? "bold"
                                                : "normal",
                                        }}
                                    />
                                    {!collapsed &&
                                        (isOpen ? (
                                            <ExpandLess/>
                                        ) : (
                                            <ExpandMore/>
                                        ))}
                                </ListItemButton>
                            </Tooltip>
                            {!collapsed && (
                                <Collapse
                                    in={open[name || ""]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <MuiList component="div" disablePadding>
                                        {renderTreeView(children, selectedKey)}
                                    </MuiList>
                                </Collapse>
                            )}
                        </div>
                    </CanAccess>
                );
            }

            return (
                <CanAccess
                    key={name}
                    resource={name.toLowerCase()}
                    action="list"
                    params={{resource: item}}
                >
                    <Tooltip
                        title={t(`${name}.${name}`)}
                        placement="right"
                        disableHoverListener={!collapsed}
                        arrow
                    >
                        <ListItemButton
                            component={Link}
                            to={name}
                            selected={isSelected}
                            onClick={setOpenSider}
                            sx={{
                                pl: isNested ? 4 : 2,
                                py: isNested ? 1.25 : 1,
                                "&.Mui-selected": {
                                    bgcolor: isSelected
                                        ? "#475be8"
                                        : "transparent",
                                    "&:hover": {
                                        bgcolor: "#1e36e8",
                                        color: (theme) => theme.palette.secondary.main,
                                    },
                                },
                                transition: '300ms linear',
                                "&:hover": {
                                    bgcolor: "#1e36e8",
                                    color: (theme) => theme.palette.secondary.main,
                                },
                                "&:hover > div": {
                                    color: (theme) => theme.palette.secondary.main,
                                },
                                justifyContent: "center",
                                margin: "10px auto",
                                borderRadius: "12px",
                                minHeight: "56px",
                                width: "90%",
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    justifyContent: "center",
                                    minWidth: 36,
                                    color: (theme) => theme.palette.secondary.main,
                                }}
                            >
                                {icon ?? <ListOutlined/>}
                            </ListItemIcon>
                            <ListItemText
                                primary={t(`${name}.${name}`)}
                                primaryTypographyProps={{
                                    noWrap: true,
                                    fontSize: "16px",
                                    fontWeight: isSelected ? "bold" : "normal",
                                    color: (theme) => theme.palette.secondary.main,
                                    marginLeft: "10px",
                                }}
                            />
                        </ListItemButton>
                    </Tooltip>
                </CanAccess>
            );
        });
    };

    const logout = isExistAuthentication && (
        <Tooltip
            title={t("buttons.logout", "Logout")}
            placement="right"
            disableHoverListener={!collapsed}
            arrow
        >
            <>
                <ModalWindow
                    open={isLogOut}
                    setOpen={setIsLogOut}
                    title={''}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: "space-between",
                        alignItems: 'center',
                        flexDirection: collapsed ? "column" : 'row',
                        gap: collapsed ? 2 : 0,
                        margin: "10px auto",
                        borderRadius: "12px",
                        height: "56px",
                        p: '0px 20px',
                        width: {xs: drawerWidth()},
                        bgcolor: 'rgba(197,176,196,0.5)'
                    }}>
                        <Button
                            sx={{
                                bgcolor: 'red',
                                p: '5px 10px',
                                height: '35px',
                                transition: '300ms linear',
                                "&:hover": {
                                    bgcolor: '#900f1a'
                                }
                            }}
                            onClick={() => setIsLogOut(false)}
                        >
                            <CloseOutlined sx={{
                                color: 'white'
                            }}/>
                        </Button>
                        <Button
                            sx={{
                                bgcolor: 'green',
                                p: '5px 10px',
                                height: '35px',
                                transition: '300ms linear',
                                "&:hover": {
                                    bgcolor: '#365d10'
                                }
                            }}
                            onClick={() => mutateLogout()}
                        >
                            <CheckOutlined sx={{
                                color: 'white'
                            }}/>
                        </Button>
                    </Box>
                </ModalWindow>
                {/*{*/}
                {/*    isLogOut*/}
                {/*        ?  :*/}
                <ListItemButton
                    key="logout"
                    onClick={() => setIsLogOut(true)}
                    sx={{
                        justifyContent: "center",
                        margin: "10px auto",
                        borderRadius: "12px",
                        minHeight: "56px",
                        width: "90%",
                        transition: '300ms linear',
                        color: (theme) => theme.palette.secondary.main,
                        "&:hover": {
                            bgcolor: 'red',
                            color: (theme) => theme.palette.secondary.main,
                            transition: '300ms linear',
                            "> div": {
                                color: (theme) => theme.palette.secondary.main
                            }
                        }
                    }}
                >
                    <ListItemIcon
                        sx={{
                            justifyContent: "center",
                            minWidth: 36,
                            color: (theme) => theme.palette.secondary.main,
                        }}
                    >
                        <Logout/>
                    </ListItemIcon>
                    <ListItemText
                        primary={t("buttons.logout", "Logout")}
                        primaryTypographyProps={{
                            noWrap: true,
                            fontSize: "16px",
                        }}
                    />
                </ListItemButton>
            </>
            {/*}*/}
        </Tooltip>
    );

    const items = renderTreeView(menuItems, selectedKey);

    const renderSider = () => {
        if (render) {
            return render({
                dashboard: undefined,
                logout,
                items,
                collapsed
            });
        }
        return (
            <>
                {items}
                {logout}
            </>
        );
    };

    const drawer = (
        <MuiList disablePadding sx={{mt: 1, color: "#fcfcfc"}}>
            {renderSider()}
        </MuiList>
    );

    return (
        <Box>
            <Box
                sx={{
                    width: {xs: drawerWidth()},
                    display: {
                        xs: "none",
                        md: "block",
                    },
                    transition: "width 0.3s ease",
                }}
            />
            <Box
                // component="nav"
                sx={{
                    // position: "fixed",
                    // zIndex: 110,
                    // width: {sm: drawerWidth()},
                    display: "flex",
                }}
            >
                {/*<StyledEngineProvider injectFirst>*/}
                <Drawer
                    variant="temporary"
                    open={openSider === 'open'}
                    onClose={setOpenSider}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        // zIndex: 10,
                        display: {sm: "block", md: "none"},
                        "& .MuiDrawer-paper": {
                            width: 256,
                            bgcolor: (theme) => theme.palette.primary.main,
                            margin: styles.marginSiderS,
                            borderRadius: styles.borderRadiusS,
                            height: styles.heightSiderS
                        },
                    }}
                >
                    <Box
                        sx={{
                            height: 64,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <RenderToTitle collapsed={false}/>
                    </Box>
                    {drawer}
                </Drawer>
                {/*</StyledEngineProvider>*/}
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: {xs: "block", md: "none"},*/}
                {/*        position: "fixed",*/}
                {/*        top: buttonSiderS.top,*/}
                {/*        left: buttonSiderS.left,*/}
                {/*        borderRadius: buttonSiderS.borderRadius,*/}
                {/*        bgcolor: "#475be8",*/}
                {/*        zIndex: 9,*/}
                {/*        width: "36px",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <IconButton*/}
                {/*        sx={{color: "#fff", width: "36px"}}*/}
                {/*        onClick={() => setOpened((prev) => !prev)}*/}
                {/*    >*/}
                {/*        <MenuRounded/>*/}
                {/*    </IconButton>*/}
                {/*</Box>*/}
                <Drawer
                    variant="permanent"
                    PaperProps={{elevation: 0}}
                    sx={{
                        display: {xs: "none", md: "block"},
                        zIndex: 8,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            bgcolor: (theme) => theme.palette.primary.main,
                            overflow: "hidden",
                            transition:
                                "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                            margin: styles.marginSiderS,
                            borderRadius: styles.borderRadiusS,
                            height: styles.heightSiderS
                        },
                    }}
                    open
                >
                    <Box
                        sx={{
                            height: 64,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <RenderToTitle collapsed={collapsed}/>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowX: "hidden",
                            overflowY: "auto",
                        }}
                    >
                        {drawer}
                    </Box>
                    <Button
                        sx={{
                            background: "#475BE8",
                            color: "primary.contrastText",
                            textAlign: "center",
                            borderRadius: 0,
                            borderTop: "1px solid #ffffff1a",
                            "&:hover": {
                                background: "#1e36e8",
                            },
                        }}
                        fullWidth
                        size="large"
                        onClick={setCollapsed}
                    >
                        {collapsed ? <ChevronRight/> : <ChevronLeft/>}
                    </Button>
                </Drawer>
            </Box>
        </Box>
    );
};

