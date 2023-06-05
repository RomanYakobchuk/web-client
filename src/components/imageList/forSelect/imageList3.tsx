import {IProps} from "../iProps";
import {useMobile} from "../../../utils";
import React, {useContext} from "react";
import {ColorModeContext} from "../../../contexts";
import {Box, Button, ImageList, ImageListItem} from "@mui/material";
import {ImageField} from "@refinedev/antd";
import {AddCircleOutline, Delete} from "@mui/icons-material";

const ImageList3 = ({items, rowHeight, maxLength, addImage, deleteImage, maxWidth, type}: IProps) => {

    const {device, width} = useMobile();
    const {mode} = useContext(ColorModeContext);

    return (
        <Box sx={{
            overflowY: 'scroll',
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
        }}>
            <ImageList
                cols={items?.length < 3 ? items?.length : 3}
                gap={8}
                variant="masonry"
            >
                {items?.map((image: any, index: number) => (
                        <ImageListItem key={index} sx={{
                            "> div": {
                                height: '100%',
                            },
                            position: 'relative'
                        }}>
                            <ImageField
                                preview={{zIndex: 10000, width: (device || width < 600) && '90%'}}
                                srcSet={image instanceof Blob ? URL.createObjectURL(image) : `${image?.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                value={type === 'show' ? image?.url :  image instanceof Blob ? URL.createObjectURL(image) : `${image?.url}?w=248&fit=crop&auto=format`}
                                style={{
                                    objectFit: 'cover',
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: '5px',
                                }}/>
                            {
                                type === 'edit' || type === 'create' &&
                                <Box sx={{
                                    display: 'flex',
                                    position: 'absolute',
                                    zIndex: 10,
                                    right: '5px',
                                    bottom: '-40%',
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
                    )
                )}
                {
                    maxLength > items?.length && type === 'create' ?
                        <ImageListItem>
                            <Button component={"label"}
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
        </Box>
    );
};
export default ImageList3
