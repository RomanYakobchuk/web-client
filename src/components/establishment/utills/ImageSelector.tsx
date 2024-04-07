import React, {useContext, useState,} from 'react';
import {Box, Button, FormControl, Typography} from "@mui/material";
import {
    Add,
    AddCircleOutline,
    DeleteForeverOutlined,
    DeleteOutline,
    Edit
} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import SortableList, {SortableItem} from "react-easy-sort";
import arrayMove from "array-move";

import {ColorModeContext} from "@/contexts";
import {antdInputStyle} from "@/styles";
import {IPicture} from "@/interfaces/common";
import {Input} from "antd";

import "./style.css";

type Props = {
    images: IPicture[] | File[] | [IPicture | File];
    defaultPictures: any;
    setPictures: (value: Props["images"]) => void;
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
        setPictures(items?.filter((_: IPicture | File, item_index: number) => item_index !== index) as Props['images']);
    }

    const addImageByUrl = async () => {
        if (addUrl) {
            if (addUrl.includes('https://')) {
                if (items.length >= maxImages) return alert(translate("home.create.pictures.max") + maxImages);

                const isImageValid = await isImage(addUrl);
                if (isImageValid) {
                    const name = addUrl?.split('/')?.pop();
                    setPictures([...items, {
                        url: addUrl,
                        name: name
                    } as IPicture] as Props['images']);
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

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setPictures(arrayMove(items, oldIndex, newIndex) as Props['images'])
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
                                flex: {xs: '1 0 120px', sm: '1 0 160px'},
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
                                flex: {xs: '1 0 120px', sm: '1 0 160px'},
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
                                    color: '#f9f9f9 !important',
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
                            disabled={items?.length >= maxImages}
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
                    <SortableList
                        className={'imageSelectorGridBody'}
                        onSortEnd={onSortEnd}
                    >
                        {
                            items?.map((item: IPicture | File, index: number) => (
                                <SortableItem
                                    key={index}
                                >
                                    <Box
                                        sx={{
                                            userSelect: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            cursor: 'grab',
                                            gap: 1,
                                            color: 'common.white',
                                        }}
                                    >
                                        <Box sx={{
                                            boxShadow: '0px 0px 3px 1px #a1a1a1',
                                            position: 'relative',
                                            backgroundImage: `url(${item instanceof File ? URL.createObjectURL(item) : item.url})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            aspectRatio: '1 / 1',
                                            maxHeight: '200px',
                                            borderRadius: {xs: '10px', sm: '15px'},
                                            objectFit: 'cover',
                                            width: '100%'
                                        }}>
                                            <DeleteOutline
                                                color={'error'}
                                                sx={{
                                                    cursor: 'pointer',
                                                    p: '5px',
                                                    bgcolor: '#f9f9f9',
                                                    borderRadius: '5px',
                                                    position: 'absolute',
                                                    top: '7px',
                                                    boxShadow: '0px 0px 3px 0px #a1a1a1',
                                                    boxSizing: 'content-box',
                                                    right: '7px'
                                                }}
                                                onClick={() => changeItem(index)}
                                            />
                                        </Box>
                                        {item.name?.substring(0, 15) + (item?.name?.length > 15 ? '...' : '')}
                                    </Box>
                                </SortableItem>
                            ))
                        }
                        {
                            (items?.length < maxImages) ? (
                                <Button component={"label"} sx={{
                                    display: 'flex',
                                    maxHeight: '200px',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    borderRadius: {xs: '10px', sm: '15px'},
                                    width: '100%',
                                    aspectRatio: '1 / 1',
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
                            ) : <></>
                        }
                    </SortableList>
                </Box>
            </FormControl>
        </>
    )
}
export default ImageSelector;


