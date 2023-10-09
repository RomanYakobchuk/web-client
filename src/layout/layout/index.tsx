import React, {useContext, useState} from "react";
import {LayoutProps} from "@refinedev/core";
import {Box, Button, Tooltip} from "@mui/material";

import {Sider as DefaultSider} from "../sider";
import {Header as DefaultHeader} from "../header";
import {Footer as DefaultFooter} from "../footer";
import {Article} from "@mui/icons-material";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useMobile} from "../../hook";
import {useSchema} from "../../settings";
import {SchemaContext} from "../../settings/schema";
import {ModalWindow} from "../../components";

export const Layout: React.FC<LayoutProps> = ({
                                                  Sider,
                                                  Header,
                                                  Footer,
                                                  OffLayoutArea,
                                              }) => {
    const SiderToRender = Sider ?? DefaultSider;
    const HeaderToRender = Header ?? DefaultHeader;
    const FooterToRender = Footer ?? DefaultFooter;
    const navigate = useNavigate();
    const {schema} = useContext(SchemaContext);
    const {device, width} = useMobile();
    const {styles} = useSchema();

    const [openModal, setOpenModal] = useState<boolean>(false);

    const someStyle = !device ? {
        '&::-webkit-scrollbar': {
            width: '10px',
            bgcolor: 'transparent',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            bgcolor: 'steelblue',
            borderRadius: '5px',
        }
    } : {};

    return (
        <Box
            display="flex" flexDirection="row"
            sx={{
                margin: styles.marginS,
                height: '100%'
            }}>
            <SiderToRender/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: styles.gapS,
                    height: '100%',
                }}
            >
                {
                    schema !== 'schema_1' && (
                        <HeaderToRender/>
                    )
                }
                <Box
                    component="main"
                    sx={{
                        height: styles.heightLayoutS,
                        overflow: 'auto',
                        borderRadius: styles.borderRadiusS,
                        bgcolor: 'common.black',
                        ...someStyle,
                        // paddingTop: schema === 'schema_1' ? '80px' : '0',
                    }}
                >
                    {
                        schema === 'schema_1' && (
                            <HeaderToRender/>
                        )
                    }
                    <Outlet/>
                    <FooterToRender/>
                    <Tooltip title={'Capl'} arrow>
                        <Button
                            onClick={() => setOpenModal(true)}
                            sx={{
                                boxShadow: '0 0 10px #ccc',
                                position: 'fixed',
                                right: width < 600 ? '5px' : '20px',
                                bottom: width < 600 ? '5px' : '20px',
                                minWidth: '50px',
                                zIndex: 10,
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',

                            }}
                            variant={"contained"}
                            color={'info'}
                        >
                            <Article/>
                        </Button>
                    </Tooltip>
                    <ModalWindow
                        open={openModal}
                        setOpen={setOpenModal}
                        title={
                            <Box>List items</Box>
                        }
                    >
                        Content
                    </ModalWindow>
                </Box>
            </Box>
            {OffLayoutArea && <OffLayoutArea/>}
        </Box>
    );
};
