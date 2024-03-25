import {useState} from "react";
import {Box} from "@mui/material";
import {Image} from "antd";

import {IPicture} from "@/interfaces/common";

interface PlaceGalleryProps {
    photos: IPicture[]
}

const ImageGalleryV1 = ({photos}: PlaceGalleryProps) => {

    const [selectedSlideNumber, setSelectedSlideNumber] = useState(0);

    const handleOpen = (i: number) => {
        setSelectedSlideNumber(i)
    }
    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box sx={{
                position: "relative",
                width: '100%',
                transition: 'all 300ms linear',
                gridTemplateRows: {xs: '200px', sm: '300px', md: '400px', lg: '340px'},
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
                    {photos[0] && (
                        <Box sx={{
                            height: "100%",
                            "& div.ant-image": {
                                height: '100%',
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
                                    height: '100%'
                                }}
                                src={photos[0].url}
                                alt=""
                            />
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: "grid",
                            gap: 1,
                            gridTemplateRows: '50% 50%',
                            overflow: "hidden",
                            height: '100%'
                        }}
                    >
                        {photos[1] && (
                            <Image
                                onClick={() => handleOpen(1)}
                                style={{
                                    cursor: "pointer",
                                    objectFit: "cover",
                                    height: '100%',
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
                                    height: '100%',
                                    width: '100%'
                                }}
                                src={photos[2]?.url}
                                alt=""
                            />
                        )}
                    </Box>
                </Image.PreviewGroup>
            </Box>
        </Box>
    );
}
export default ImageGalleryV1;