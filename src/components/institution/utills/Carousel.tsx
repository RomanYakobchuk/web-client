import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {useTranslate} from "@refinedev/core";

import {ImageList1, ImageList2, ImageList3} from "../../imageList";

interface CarouselProps {
    onChange: any,
    items?: [] | any,
    maxImages: number,
    rowHeight: number,
    setVariantForDisplay: any,
    variantForDisplay: string
}

const Carousel = ({onChange, items, maxImages, rowHeight, setVariantForDisplay, variantForDisplay}: CarouselProps) => {

        const translate = useTranslate();

        const [maxLength, setMaxLength] = useState<number>(maxImages);

        useEffect(() => {
            setMaxLength(maxImages)
        }, [maxImages])

        const deleteImage = (index: number) => {
            onChange(items.filter((_: any, i: any) => i !== index))
        }
        useEffect(() => {
            onChange(items)
        }, [items])


        const addImage = (e: ChangeEvent<HTMLInputElement> | any) => {
            const newItems = [];
            const elements = e.target.files;

            if (maxImages < items.length + elements.length) return alert(translate("home.create.otherPhoto.max") + maxImages)
            if (elements) {
                for (let i = 0; i < elements?.length; i++) {
                    const item = elements[i];
                    newItems.push(item)
                }
            }

            onChange([...items, ...newItems])
        }
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                overflow: "hidden",
            }}>
                <Box sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography>
                        {translate("home.create.otherPhoto.message")}
                    </Typography>
                    <Select
                        size={"small"}
                        color={"secondary"}
                        value={variantForDisplay ?? 1}
                        onChange={(e: SelectChangeEvent<any>) => setVariantForDisplay(e.target.value)}
                    >
                        {
                            ['1', '2', '3'].map((item, index) => (
                                <MenuItem key={index} value={item}>
                                    {translate("home.create.otherPhoto.variant") + ' - ' + item}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </Box>
                {
                    variantForDisplay === '1' ?
                        <ImageList1
                            maxWidth={"800px"}
                            addImage={addImage}
                            rowHeight={rowHeight}
                            items={items}
                            deleteImage={deleteImage}
                            maxLength={maxLength}
                            type={'create'}
                        />
                        : variantForDisplay === '2'
                            ? <ImageList2
                                type={'create'}
                                maxWidth={"800px"}
                                addImage={addImage}
                                rowHeight={rowHeight}
                                items={items}
                                deleteImage={deleteImage}
                                maxLength={maxLength}
                            />
                            : <ImageList3
                                type={'create'}
                                maxWidth={"800px"}
                                addImage={addImage}
                                rowHeight={rowHeight}
                                items={items}
                                deleteImage={deleteImage}
                                maxLength={maxLength}/>
                }
            </Box>
        );
    }
;

export default Carousel;