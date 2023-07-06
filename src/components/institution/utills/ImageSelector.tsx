import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, FormControl, Typography} from "@mui/material";
import {AddCircleOutline, DeleteForeverOutlined, Edit} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import Carousel from "./Carousel";
import {ColorModeContext} from "../../../contexts";
import {useMobile} from "../../../utils";
import {buttonStyle} from "../../../styles";

interface Props {
    images: string[] | any;
    setOtherPhoto: any;
    handleChange: any;
    maxImages: number,
    setVariantForDisplay: any,
    variantForDisplay: string
}


const ImageSelector = ({
                           images: items,
                           handleChange,
                           setOtherPhoto,
                           maxImages,
                           setVariantForDisplay,
                           variantForDisplay
                       }: Props) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const {device, width} = useMobile();

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
                                            width: '130px',
                                            textTransform: 'capitalize',
                                            ...buttonStyle
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
                                        onClick={() => setOtherPhoto([])}
                                        sx={{
                                            ...buttonStyle,
                                            width: '170px',
                                            textTransform: 'capitalize',
                                        }}
                                        startIcon={
                                            <DeleteForeverOutlined/>
                                        }
                                    >
                                        {translate("home.create.otherPhoto.deleteAll")}
                                    </Button>
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
                            {translate("home.create.otherPhoto.count")}: {items.length}
                        </Typography>
                    }
                    {
                        items?.length > 0 ?
                            <Carousel variantForDisplay={variantForDisplay} setVariantForDisplay={setVariantForDisplay}
                                      rowHeight={device && width < 600 ? 120 : 200} maxImages={maxImages} items={items}
                                      onChange={setOtherPhoto}/>

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


