import {useState} from "react";
import {Box} from "@mui/material";
import {Image} from "antd";
import {IPicture} from "../../interfaces/common";

import {useMobile} from "../../hook";

interface PlaceGalleryProps {
    photos: IPicture[]
}

const ImageGalleryV1 = ({photos}: PlaceGalleryProps) => {
    const {width} = useMobile();

    const [selectedSlideNumber, setSelectedSlideNumber] = useState(0);

    const height = width < 600 ? '208px' : width < 900 ? '308px' : width < 1200 ? '408px' : '388px';
    const height1 = '100%';
    const height2 = width < 600 ? '100px' : width < 900 ? '150px' : width < 1200 ? '200px' : '195px';


    const handleOpen = (i: number) => {
        setSelectedSlideNumber(i)
    }
    return (
        <Box sx={{
            position: "relative",
            width: '100%',
            transition: 'all 300ms linear',
            height,
            display: "grid",
            gap: 1,
            gridTemplateColumns: "2fr 1fr",
            borderRadius: "20px",
            overflow: "hidden",
            // height
        }}>
            <Image.PreviewGroup
                items={photos?.map((photo) => (photo.url))}
                preview={{
                    onChange: (current) => setSelectedSlideNumber(current),
                    current: selectedSlideNumber
                }}
            >
                <Box>
                    {photos[0] && (
                        <Box sx={{
                            height,
                            "& div.ant-image": {
                                height: height1,
                                width: '100%'
                            }
                        }}>
                            <Image
                                onClick={() => handleOpen(0)}
                                style={{
                                    cursor: "pointer",
                                    width: '100%',
                                    // aspectRatio: "square",
                                    objectFit: "cover",
                                    height: height1
                                }}
                                src={photos[0].url}
                                alt=""
                            />
                        </Box>
                    )}
                </Box>
                <Box
                    sx={{
                        display: "grid",
                        gap: 1,
                        gridTemplateRows: '1fr 1fr',
                        overflow: "hidden",
                    }}
                >
                    {photos[1] && (
                        <Image
                            onClick={() => handleOpen(1)}
                            style={{
                                cursor: "pointer",
                                objectFit: "cover",
                                height: height2,
                                width: '100%',
                            }}
                            src={photos[1]?.url}
                            alt=""
                        />
                    )}
                    {photos[2] && (
                        <Image
                            onClick={() => handleOpen(2)}
                            style={{
                                cursor: "pointer",
                                // aspectRatio: "square",
                                objectFit: "cover",
                                position: "relative",
                                height: height2,
                                width: '100%'
                            }}
                            src={photos[2]?.url}
                            alt=""
                        />
                    )}
                </Box>
            </Image.PreviewGroup>
        </Box>
    );
}
export default ImageGalleryV1;