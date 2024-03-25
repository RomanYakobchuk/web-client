import {useContext, useEffect, useState} from "react";
import {Sider as DefaultSider} from "@refinedev/mui";

import {
    Box,
    Button,
    Collapse,
    Drawer,
    List as MuiList,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import {ChevronLeft, ChevronRight, ExpandLess, ExpandMore, ListOutlined,} from "@mui/icons-material";
import {CanAccess, ITreeMenu, useLink, useMenu, useTitle, useTranslate,} from "@refinedev/core";

import {Title as DefaultTitle} from "../title";
import {useSchema} from "@/settings";
import {ColorModeContext} from "@/contexts";
import {LogoutComponent} from "@/layout/common";
import {SchemaContext} from "@/settings/schema";

export const Sider: typeof DefaultSider = ({render}) => {

    const {schema} = useContext(SchemaContext);
    const {mode, open: openSider, setOpen: setOpenSider, collapsed, setCollapsed} = useContext(ColorModeContext);

    const drawerWidth = () => {
        if (collapsed) return 64;
        return 200;
    };
    const drawerXsWidth = () => {
        if (collapsed) return 68;
        return 256;
    };
    const logout = LogoutComponent({});

    const t = useTranslate();
    const Link = useLink();

    const {menuItems, selectedKey, defaultOpenKeys} = useMenu();
    const Title = useTitle();
    const {styles} = useSchema();

    const [open, setOpen] = useState<{ [k: string]: any }>({});
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
            return Object.fromEntries(
                Array.from(uniqueKeys.values()).map((key) => [key, true]),
            );
        });
    }, [defaultOpenKeys]);

    const RenderToTitle = Title ?? DefaultTitle;

    const handleClick = (key: string) => {
        setOpen({...open, [key]: !open[key]});
    };

    const renderTreeView = (tree: ITreeMenu[], selectedKey: string) => {
        return tree.map((item: ITreeMenu) => {
            const {name, children, list, meta: {icon, parent: parentName}, route}: any = item;
            const isOpen = open[name || ""] || false;
            const isSelected = route === path;
            const isNested = !(parentName === undefined);

            if (children.length > 0) {
                return (
                    <CanAccess
                        key={list}
                        resource={list.toLowerCase()}
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
                                            color: isSelected ? '#fff' : "primary.contrastText",
                                        }}
                                    >
                                        {icon ?? <ListOutlined/>}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={t(`${name}.${name}`)}
                                        primaryTypographyProps={{
                                            noWrap: true,
                                            color: isSelected ? '#fff' : "primary.contrastText",
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
                                    color: isSelected ? '#fff' : "primary.contrastText",
                                    "&:hover": {
                                        bgcolor: "#1e36e8",
                                        color: '#fff',
                                    },
                                },
                                transition: '300ms linear',
                                color: isSelected ? '#fff' : "primary.contrastText",
                                // "& *": {
                                //     color: isSelected ? '#fff' : "primary.contrastText",
                                // },
                                "&:hover": {
                                    bgcolor: "#1e36e8",
                                    color: '#fff',
                                },
                                "&:hover > div, &:hover span": {
                                    color: '#fff',
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
                                    color: isSelected ? '#fff' : 'secondary.main',
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
                                    color: isSelected ? '#fff' : "secondary.main",
                                    marginLeft: "10px",
                                }}
                            />
                        </ListItemButton>
                    </Tooltip>
                </CanAccess>
            );
        });
    };

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
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
            }}>
                <div>
                    {items}
                </div>
                <div>
                    {logout}
                </div>
            </Box>
        );
    };

    const drawer = (
        <MuiList disablePadding sx={{
            mt: 1,
            color: "#fcfcfc",
            height: '98%'
        }}>
            {renderSider()}
        </MuiList>
    );

    const drawerBgColor = mode === 'dark' ? '#2f2d3d' : '#fafafa'

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
                        display: {sm: "block", md: "none"},
                        "& .MuiDrawer-paper": {
                            width: drawerXsWidth,
                            transition:
                                "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                            // bgcolor: 'common.black',
                            bgcolor: drawerBgColor,
                            backdropFilter: 'blur(3px)',
                            margin: styles.marginSiderS,
                            borderRight: '1px solid silver',
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
                <Drawer
                    variant="permanent"
                    PaperProps={{elevation: 0}}
                    sx={{
                        display: {xs: "none", md: "block"},
                        zIndex: 8,
                        "& .MuiDrawer-paper": {
                            // borderRight: schema === 'schema_1' ? '1px dashed silver' : '',
                            width: drawerWidth,
                            // bgcolor: 'common.black',
                            bgcolor: drawerBgColor,
                            overflow: "hidden",
                            transition:
                                "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                            margin: schema === 'schema_1' ? styles.marginSiderS : '5px 5px 5px 5px',
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

