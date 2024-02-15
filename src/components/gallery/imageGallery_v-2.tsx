import {useContext, useEffect, useState} from "react";
import {Box, SxProps} from "@mui/material";
import {Image} from "antd";

import {IPicture} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useMobile} from "@/hook";
import {touchScroll} from "../common/scroll/touchScroll";

type TProps = {
    images: IPicture[],
    styles?: SxProps
}
const ImageGalleryV2 = ({images, styles}: TProps) => {

    const {width, device} = useMobile();
    const {collapsed} = useContext(ColorModeContext);

    const [currentImage, setCurrentImage] = useState<number>(0);
    const [gallery, setGallery] = useState<IPicture[]>(images);


    useEffect(() => {
        if (images?.length > 0) {
            setGallery(images);
            setCurrentImage(0);
        }
    }, [images]);

    const handleCurrentImage = (index: number) => {
        if (index >= 0 && index !== currentImage && images?.length > 0) {
            setCurrentImage(index);
        }
    }

    useEffect(() => {
        touchScroll('.imageGalleryV2_scrollContent');
    }, [gallery?.length]);

    const height = width < 600 ? '200px' : width < 900 ? '350px' : width > 1500 ? '450px' : '350px';
    const isMoreOne = gallery?.length > 1;
    const changeImageWidth = gallery?.length === 2 ? 'calc(50% - 4px)' : gallery?.length === 3 ? 'calc(100% / 3 - 4px)' : '150px';
    const changeImageHeight = gallery?.length === 2 ? '100px' : '80px';

    const maxWidth = width > 900 ? (collapsed ? 'calc(100vw - 104px)' : 'calc(100vw - 240px)') : 'calc(100vw - 30px)';

    const someStyle = !device ? {
        '&::-webkit-scrollbar': {
            height: '7px',
            bgcolor: 'transparent',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            bgcolor: 'silver',
            borderRadius: '5px',
        }
    } : {};

    return (
        <Box sx={{
            width: '100%',
            "& img": {
                borderRadius: '7px'
            },
            display: 'flex',
            flexDirection: 'column',
            gap: isMoreOne ? 1 : 0,
            ...styles
        }}>
            {
                gallery?.length > 0 && (
                    <Image.PreviewGroup
                        items={gallery?.map((item) => (item?.url))}
                        preview={{
                            onChange: (current) => setCurrentImage(current),
                            current: currentImage
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            height: height,
                            "& div.ant-image": {
                                width: '100%',
                                height: height,
                            }
                        }}>
                            <Image
                                style={{
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                src={gallery[currentImage]?.url}/>
                        </Box>
                    </Image.PreviewGroup>
                )
            }
            {
                gallery?.length > 1 && (
                    <Box sx={{
                        width: '100%',
                        maxWidth: maxWidth,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        pb: '10px',
                        ...someStyle,
                    }}
                    className={'imageGalleryV2_scrollContent'}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            width: gallery?.length > 3 ? 'fit-content' : '100%'
                        }}>
                            {
                                gallery?.map((value, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: changeImageWidth,
                                            height: {xs: changeImageHeight, md: '100px'},
                                            borderRadius: '12px',
                                            border: `5px solid ${index === currentImage ? '#3ebafa' : 'transparent'}`,
                                            cursor: 'pointer',
                                            transition: '200ms linear',
                                            "&:hover": {
                                                border: `5px solid #3ebafa`,
                                            }
                                        }}
                                        onClick={() => handleCurrentImage(index)}
                                    >
                                        <img
                                            src={value?.url}
                                            alt={value?.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Box>
                                ))
                            }
                        </Box>
                    </Box>
                )
            }
        </Box>
    );
};
export default ImageGalleryV2;
