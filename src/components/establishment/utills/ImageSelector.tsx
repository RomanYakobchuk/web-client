import React, {useContext,} from 'react';
import {Box, Button, FormControl, Typography} from "@mui/material";
import {AddCircleOutline, DeleteForeverOutlined, DeleteOutline, Edit} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../../contexts";
import {useMobile} from "../../../utils";
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

    const {device, width} = useMobile();

    const changeItem = (index: number) => {
        setPictures(items.filter((item: {name: string, url: string} | File, item_index: number) => item_index !== index))
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
                    gap: {xs: 1, md: 2}
                }}>
                    {
                        items && items?.length > 0
                            ? <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: {xs: 'column', md: 'row'},
                                alignItems: 'center',
                                gap: 2,
                                justifyContent: 'start'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2
                                }}>
                                    <Button
                                        component="label"
                                        color={'info'}
                                        variant={'contained'}
                                        sx={{
                                            ...buttonStyle,
                                            width: '130px',
                                        }}
                                        startIcon={
                                            <Edit/>
                                        }
                                    >
                                        {translate("profile.edit.change")}
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
                                            width: '170px',
                                            textTransform: 'capitalize',
                                        }}
                                        startIcon={
                                            <DeleteForeverOutlined/>
                                        }
                                    >
                                        {translate("home.create.pictures.deleteAll")}
                                    </Button>
                                    <Button
                                        color={'success'}
                                        onClick={getDefaultPictures}
                                    >Reset</Button>
                                </Box>
                            </Box>
                            : <div></div>
                    }

                </Box>
                <Box sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    borderRadius: "5px",

                }}>
                    {
                        items?.length > 0 &&
                        <Typography>
                            {translate("home.create.pictures.count")}: {items.length}
                        </Typography>
                    }
                    {
                        items?.length > 0 ?
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                                flexWrap: 'wrap',

                            }}>
                                {
                                    items?.map((item: {name: string, url: string} | File, index: number) => (
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
                                                    boxSizing:'content-box',
                                                    right: '10px'
                                                }}
                                                onClick={()=> changeItem(index)}
                                            />
                                        </Box>
                                    ))
                                }
                            </Box>
                            : <Button component={"label"} sx={
                                {
                                    width: "100%",
                                    height: {xs: '120px', sm: "200px"},
                                    display: 'flex',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: '5px',
                                    cursor: "pointer",
                                    mb: 2,
                                    transition: "300ms linear",
                                    "&:hover": {
                                        bgcolor: 'silver',
                                    },
                                    border: `1px dashed ${mode === "dark" ? "#fcfcfc" : "#9ba5c9"}`
                                }
                            }>
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
                    }
                </Box>
            </FormControl>
        </>
    )
}
export default ImageSelector;


