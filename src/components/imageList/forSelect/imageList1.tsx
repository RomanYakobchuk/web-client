import {Box, Button, ImageList, ImageListItem} from "@mui/material";
import {AddCircleOutline, Delete} from "@mui/icons-material";
import React, {useContext} from "react";
import {ImageField} from "@refinedev/antd";

import {srcset, useMobile} from "../../../utils";
import {ColorModeContext} from "../../../contexts";
import {IProps} from "../iProps";


const ImageList1 = ({items, rowHeight, maxLength, addImage, deleteImage, maxWidth, type}: IProps) => {

    const {device, width} = useMobile();
    const {mode} = useContext(ColorModeContext);

    return (

        <ImageList
            sx={{
                width: "100%",
                maxWidth: maxWidth,
                maxHeight: {xs: 450, sm: 650},
                "&::-webkit-scrollbar": {
                    width: '5px'
                },
                "&::-webkit-scrollbar-thumb": {
                    bgcolor: 'silver',
                    borderRadius: '10px'
                }
            }}
            variant="quilted"
            cols={4}
            rowHeight={rowHeight}>
            {
                items?.map((image: any, index: number) => (
                    <ImageListItem
                        key={index}
                        cols={(index === 0 || index === 3 || index === 4 || index === 5 || index === 8 || index === 11) ? 2 : 1}
                        rows={(index === 0 || index === 5 || index === 8) ? 2 : 1}
                        sx={{
                            height: {xs: '100px', sm: '150px', md: '200px'},
                            "> div.ant-image": {
                                height: '100%',
                                display: 'block'
                            },
                            position: 'relative'
                        }}>
                        <ImageField
                            {...srcset(
                                image,
                                121,
                                (index === 0 || index === 5 || index === 8) ? 2 : 1,
                                (index === 0 || index === 3 || index === 4 || index === 5 || index === 8 || index === 11) ? 2 : 1)}
                            preview={{zIndex: 10000, width: (device || width < 600) && '90%'}}
                            value={type === 'show' ? image?.url : image instanceof Blob ? URL.createObjectURL(image) : image?.url}
                            style={{
                                objectFit: 'cover',
                                height: '100%',
                                width: '100%',
                            }}/>
                        {
                            type === 'edit' || type === 'create' &&
                            <Box sx={{
                                display: 'flex',
                                position: 'absolute',
                                zIndex: 10,
                                right: '5px',
                                bottom: 0,
                                height: '50px',
                                cursor: 'pointer',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                                color: 'red',
                                "&:hover": {
                                    color: 'red'
                                }
                            }}>
                                <Delete onClick={() => deleteImage(index)}/>
                            </Box>
                        }
                    </ImageListItem>

                ))
            }
            {
                maxLength > items?.length && type === "create" ?
                    <ImageListItem
                        cols={(items?.length - 1 === 0 || items?.length - 1 === 3 || items?.length - 1 === 4 || items?.length - 1 === 5 || items?.length - 1 === 8 || items?.length - 1 === 11) ? 2 : 1}
                        rows={(items?.length - 1 === 0 || items?.length - 1 === 5 || items?.length - 1 === 8) ? 2 : 1}
                    >
                        <Button component={"label"}
                                {...srcset("", 121,
                                    (items?.length - 1 === 0 || items?.length - 1 === 7 || items?.length - 1 === 8 || items?.length - 1 === 3 || items?.length - 1 === 4) ? 2 : 1,
                                    (items?.length - 1 === 0 || items?.length - 1 === 7 || items?.length - 1 === 8) ? 2 : 1)}
                                sx={
                                    {
                                        width: "100%",
                                        height: rowHeight,
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
                                fontSize: "60px"
                            }}/>
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                multiple
                                onChange={addImage}
                            />
                        </Button>
                    </ImageListItem> : ""
            }
        </ImageList>
    );
};
export default ImageList1
