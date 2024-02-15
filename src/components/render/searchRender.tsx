import {Typography as TypographyAntd} from "antd";
import {Box, Button} from "@mui/material";
import {Link} from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import React from "react";

const {Text} = TypographyAntd;
const renderTitle = (title: string, mode: string, onClick?: () => void) => {
    return (
        <Button
            variant={'text'}
            sx={{
                minWidth: '30px',
                p: 0,
                textTransform: 'inherit'
            }}
            onClick={(event) => {
                if (onClick) {
                    event.preventDefault();
                    onClick();
                }
            }}
        >
            <Text
                strong
                style={{
                    fontSize: "16px",
                    color: mode === 'dark' ? '#fcfcfc' : '#000'
                }}>
                {title}
            </Text>
        </Button>
    );
};

const renderItem = (item: any, resource: string, index: number, mode: string, setOpen: (value: boolean) => void, length: number, t?: any, link?: string) => {

    const text2 = item?.description ?? item?.text ?? '';

    return {
        value: item?.title,
        key: item?._id,
        label: (
            <Box component={Link}
                 to={link || '#'}
                 onClick={() => {
                     setTimeout(() => {
                         setOpen(false)
                     }, 500)
                 }}
                 key={item?._id} sx={{
                display: 'flex',
                textDecoration: 'none',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: '10px',
                borderRadius: '5px',
                height: '100%',
                p: '10px 10px 10px 20px',
                border: '2px solid transparent',
                position: 'relative',
                "&:hover": {
                    border: '2px solid #5f89bd'
                },
                "&:before": {
                    content: '""',
                    position: 'absolute',
                    left: '5px',
                    top: index === length - 1 ? '10%' : 'unset',
                    height: index === length - 1 ? '40%' : '80%',
                    width: '2px',
                    bgcolor: 'silver'
                },
                "&:after": {
                    content: '""',
                    position: 'absolute',
                    left: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '2px',
                    width: '10px',
                    bgcolor: 'silver'
                }
            }}>
                <Box sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: 1,
                    alignItems: 'center'
                }}>
                    <Box sx={{
                        fontWeight: {xs: 500, sm: 600},
                        color: mode === 'dark' ? '#fcfcfc' : '#000',
                        textTransform: 'capitalize',
                        fontSize: {xs: '16px', sm: '18px'},
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        height: '100%',
                        gap: item?.type ? 0.5 : 0
                    }}>
                        <Box sx={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {item?.title ?? ''}
                        </Box>
                        {
                            item?.type && (
                                <Box sx={{
                                    borderRadius: '10px',
                                    p: '3px 7px',
                                    fontSize: '12px',
                                    bgcolor: 'common.white',
                                    color: 'common.black'
                                }}>
                                    {t(`home.create.type.${item?.type}`)}
                                </Box>
                            )
                        }
                    </Box>
                    <MDEditor.Markdown
                        style={{
                            color: '#74a496',
                            background: 'transparent',
                            fontSize: '14px',
                        }}
                        source={text2?.length > 20 ? `${text2.substring(0, 20)}...` : text2}
                    />
                    {/*<Box*/}
                    {/*    sx={{*/}
                    {/*        color: 'silver',*/}
                    {/*        fontSize: {xs: '12px', sm: '14px'},*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*</Box>*/}
                </Box>
                {/*<OpenInNewOutlined onClick={() => window.location.replace(`/${resource}/show/${id}`)}/>*/}
            </Box>
        ),
    };
};

export {
    renderTitle,
    renderItem
}