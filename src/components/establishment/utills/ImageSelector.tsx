import React, {useContext, useState,} from 'react';
import {Box, Button, FormControl, IconButton, Typography} from "@mui/material";
import {
    Add,
    AddCircleOutline,
    ArrowBackIosNew,
    ArrowForwardIos,
    DeleteForeverOutlined,
    DeleteOutline,
    Edit
} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "@/contexts";
import {antdInputStyle} from "@/styles";
import {IPicture} from "@/interfaces/common";
import {Input} from "antd";

type Props = {
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

    const [addUrl, setAddUrl] = useState<string>('');
    const changeItem = (index: number) => {
        setPictures(items.filter((_: IPicture | File, item_index: number) => item_index !== index))
    }

    const addImageByUrl = async () => {
        if (addUrl) {
            if (addUrl.includes('https://')) {
                if (items.length >= maxImages) return alert(translate("home.create.pictures.max") + maxImages);

                const isImageValid = await isImage(addUrl);
                if (isImageValid) {
                    const name = addUrl?.split('/')?.pop();
                    setPictures((prev: IPicture[] | File[]) => ([...prev, {
                        url: addUrl,
                        name: name
                    } as IPicture] as IPicture | File[]));
                    setAddUrl('')
                }
                return;
            } else {
                alert('The URL should contain https://')
            }
        }
    }

    const getDefaultPictures = () => {
        setPictures(defaultPictures)
    }

    const moveBack = (index: number) => {
        const newList = [...items];
        const temp = newList[index];
        newList[index] = newList[index === 0 ? items?.length - 1 : index - 1];
        newList[index === 0 ? items?.length - 1 : index - 1] = temp;
        setPictures(newList)
    }
    const moveForward = (index: number) => {
        const newList = [...items];
        const temp = newList[index];
        newList[index] = newList[index === items?.length - 1 ? 0 : index + 1];
        newList[index === items?.length - 1 ? 0 : index + 1] = temp;
        setPictures(newList)
    }

    function isImage(url: string) {
        const img = new Image();
        img.src = url;
        return new Promise((resolve) => {
            img.onload = () => {
                const extension = url?.split('.')?.pop()?.toLowerCase() as string;
                if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension) || img?.naturalWidth || img?.complete) {
                    resolve(true);
                } else {
                    alert('It`s not a supported picture format.');
                    resolve(false);
                }
            };

            img.onerror = () => {
                alert('It`s not a picture!!!.');
                resolve(false);
            };
        });
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
                            gap: {xs: 1, sm: 2},
                            flexWrap: 'wrap',
                            maxWidth: '550px',
                            width: '100%',
                            "& svg": {
                                fontSize: {xs: '20px', sm: '24px'}
                            },
                            "& button": {
                                flex: {xs: '1 0 100px', sm: '1 0 160px'},
                                fontSize: {xs: '14px', md: '16px'},
                                p: {xs: '3px 5px', sm: 'unset'},
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                borderRadius: '7px',
                                height: '40px',
                                textTransform: 'inherit',
                            },
                            "& label": {
                                flex: {xs: '1 0 100px', sm: '1 0 160px'},
                                fontSize: {xs: '14px', md: '16px'},
                                p: {xs: '3px 5px', sm: 'unset'},
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                borderRadius: '7px',
                                height: '40px',
                                textTransform: 'inherit',
                            }
                        }}>
                            <Button
                                component="label"
                                color={'info'}
                                variant={'contained'}
                                sx={{
                                    textTransform: 'inherit',
                                    width: 'fit-content',
                                }}
                            >
                                <Edit/>
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
                                    width: 'fit-content',
                                }}
                            >
                                <DeleteForeverOutlined/>
                                {translate("buttons.delete") + ' ' + translate('home.sortByType.all')}
                            </Button>
                            {
                                defaultPictures?.length > 0 && (
                                    <Button
                                        variant={'contained'}
                                        color={'success'}
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
                    <Typography sx={{
                        color: 'common.white'
                    }}>
                        {translate("home.create.pictures.count")}: {items?.length}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        gap: 2,
                        alignItems: 'center',
                        mb: '15px',
                        ...antdInputStyle
                    }}>
                        <Input
                            size={'large'}
                            value={addUrl ?? ''}
                            placeholder={'Enter image url...'}
                            onChange={(event) => setAddUrl(event.target.value)}
                        />
                        <Button
                            disabled={items?.length >= maxImages}
                            variant={'contained'}
                            color={'info'}
                            onClick={addImageByUrl}
                        >
                            <Add/>
                        </Button>
                    </Box>

                    <Box sx={{
                        width: '100%',
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)'}
                    }}>
                        {
                            items?.map((item: IPicture | File, index: number) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        gap: 1,
                                        color: 'common.white',
                                        "& img": {
                                            borderRadius: {xs: '10px', sm: '15px'},
                                            height: {xs: '150px', sm: '195px', md: '150px', lg: '195px'},
                                            objectFit: 'cover',
                                            width: '100%'
                                        }
                                    }}
                                    key={index}>
                                    <Box sx={{
                                        position: 'relative',
                                    }}>
                                        <img
                                            style={{
                                                objectFit: 'cover'
                                            }}
                                            src={item instanceof File ? URL.createObjectURL(item) : item.url}
                                            alt={item.name}/>
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
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: '0px',
                                            borderRadius: {xs: '0 0 10px 10px', sm: '0 0 15px 15px'},
                                            bgcolor: 'rgba(255, 255, 255, 0.5)',
                                            left: 0,
                                            right: 0,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            p: '0px 10px',
                                            alignItems: 'center',
                                            "& button": {
                                                color: '#000'
                                            }
                                        }}>
                                            <IconButton
                                                onClick={() => moveBack(index)}
                                            >
                                                <ArrowBackIosNew/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => moveForward(index)}
                                            >
                                                <ArrowForwardIos/>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    {item.name?.substring(0, 15) + (item?.name?.length > 15 ? '...' : '')}
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
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '120px',
                                    mb: 2,
                                    transition: "300ms linear",
                                    "&:hover": {
                                        bgcolor: 'silver',
                                    },
                                    border: `1px dashed ${mode === "dark" ? "#fcfcfc" : "#9ba5c9"}`
                                }}>
                                    <AddCircleOutline sx={{
                                        color: mode === "dark" ? "#fcfcfc" : "#9ba5c9",
                                        fontSize: {xs: "70px", sm: '90px', md: "100px", lg: '120px'}
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


