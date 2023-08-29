import React, {useContext,} from 'react';
import {Box, Button, FormControl, Typography} from "@mui/material";
import {AddCircleOutline, DeleteForeverOutlined, DeleteOutline, Edit} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../../contexts";
import {buttonStyle} from "../../../styles";

interface Props {
    images: string[] | any;
    defaultPictures: any;
    setPictures: any;
    handleChange: any;
    maxImages: number,
}


const ImageSelector = ({
                           images: items,
                           handleChange,
                           defaultPictures,
                           setPictures,
                           maxImages,
                       }: Props) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const changeItem = (index: number) => {
        setPictures(items.filter((_: {
            name: string,
            url: string
        } | File, item_index: number) => item_index !== index))
    }

    const getDefaultPictures = () => {
        setPictures(defaultPictures)
    }
    return (
        <>
            <FormControl sx={{
                display: 'flex',
                flexDirection: "column",
                gap: {xs: 1, md: 3},
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: {xs: 1, md: 2},
                    width: '100%'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: {xs: 'column', md: 'row'},
                        alignItems: 'center',
                        gap: {xs: 1, sm: 2},
                        width: '100%',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            width: '100%',
                            "& button": {
                                flex: '1 1 160px',
                                maxWidth: '300px'
                            },
                            "& label": {
                                maxWidth: '300px',
                                flex: '1 1 160px'
                            }
                        }}>
                            <Button
                                component="label"
                                color={'info'}
                                variant={'contained'}
                                sx={{
                                    ...buttonStyle,
                                    textTransform: 'inherit',
                                    width: 'fit-content',
                                }}
                                startIcon={
                                    <Edit/>
                                }
                            >
                                {translate("buttons.edit") + ' ' + translate('home.sortByType.all')}
                                <input
                                    hidden
                                    multiple
                                    accept="image/*"
                                    type="file"
                                    onChange={handleChange}
                                />
                            </Button>
                            <Button
                                variant={'contained'}
                                color={'error'}
                                onClick={() => setPictures([])}
                                sx={{
                                    ...buttonStyle,
                                    width: 'fit-content',
                                }}
                                startIcon={
                                    <DeleteForeverOutlined/>
                                }
                            >
                                {translate("buttons.delete") + ' ' + translate('home.sortByType.all')}
                            </Button>
                            {
                                defaultPictures?.length > 0 && (
                                    <Button
                                        variant={'contained'}
                                        color={'success'}
                                        sx={{
                                            ...buttonStyle
                                        }}
                                        onClick={getDefaultPictures}
                                    >
                                        {translate('buttons.restore')}
                                    </Button>
                                )
                            }
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    borderRadius: "5px",
                }}>
                    <Typography>
                        {translate("home.create.pictures.count")}: {items?.length}
                    </Typography>

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        flexWrap: 'wrap',

                    }}>
                        {
                            items?.map((item: { name: string, url: string } | File, index: number) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: {xs: '150px', md: '195px'},
                                        whiteSpace: '',
                                        position: 'relative',
                                        gap: 1,
                                        "& img": {
                                            borderRadius: {xs: '10px', sm: '15px'},
                                            width: {xs: '150px', md: '195px'},
                                            height: {xs: '150px', md: '195px'},
                                        }
                                    }}
                                    key={index}>
                                    <img
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                        src={item instanceof File ? URL.createObjectURL(item) : item.url}
                                        alt={item.name}/>
                                    {item.name}
                                    <DeleteOutline
                                        color={'error'}
                                        sx={{
                                            cursor: 'pointer',
                                            p: '5px',
                                            bgcolor: 'silver',
                                            borderRadius: '5px',
                                            position: 'absolute',
                                            top: '10px',
                                            boxSizing: 'content-box',
                                            right: '10px'
                                        }}
                                        onClick={() => changeItem(index)}
                                    />
                                </Box>
                            ))
                        }
                        {
                            (items?.length < maxImages) && (
                                <Button component={"label"} sx={{
                                    display: 'flex',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    borderRadius: {xs: '10px', sm: '15px'},
                                    width: {xs: '150px', md: '195px'},
                                    height: {xs: '150px', md: '195px'},
                                    mb: 2,
                                    transition: "300ms linear",
                                    "&:hover": {
                                        bgcolor: 'silver',
                                    },
                                    border: `1px dashed ${mode === "dark" ? "#fcfcfc" : "#9ba5c9"}`
                                }}>
                                    <AddCircleOutline sx={{
                                        color: mode === "dark" ? "#fcfcfc" : "#9ba5c9",
                                        fontSize: {xs: "70px", md: "160px"}
                                    }}/>
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        onChange={handleChange}
                                    />
                                </Button>
                            )
                        }
                    </Box>
                </Box>
            </FormControl>
        </>
    )
}
export default ImageSelector;


