import {useState} from "react";
import {Box} from "@mui/material";
import {Image} from "antd";

import {IPicture} from "@/interfaces/common";
import {motion} from "framer-motion";

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
                width: '100%',
                maxWidth: '100%',
            }}
        >
            <Box sx={{
                position: "relative",
                width: '100%',
                transition: 'all 300ms linear',
                gridTemplateRows: {xs: '200px', sm: '350px', md: '400px', lg: '340px'},
                "@media screen and (500px <= width <= 600px)": {
                    gridTemplateRows: '300px'
                },
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
                        <motion.div
                            key={photos[0]?.name || photos[0]?.url}
                            initial={{
                                opacity: 0,
                                y: 100
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.6,
                                delay: 0.8,
                            }}
                            style={{
                                height: '100%',
                                width: '100%'
                            }}
                        >
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
                        </motion.div>
                    )}
                    <Box
                        sx={{
                            display: "grid",
                            gap: 1,
                            gridTemplateRows: '50% 50%',
                            overflow: "hidden",
                            height: '100%',
                            "& div.ant-image": {
                                height: '100%',
                                width: '100%',
                            }
                        }}
                    >
                        {photos[1] && (
                            <motion.div
                                key={photos[1]?.name || photos[1]?.url}
                                initial={{
                                    opacity: 0,
                                    y: 100
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: 1.2,
                                }}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                            >
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
                            </motion.div>
                        )}
                        {photos[2] && (
                            <motion.div
                                key={photos[2]?.name || photos[2]?.url}
                                initial={{
                                    opacity: 0,
                                    y: 100
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: 1.6,
                                }}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                            >
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
                            </motion.div>
                        )}
                    </Box>
                </Image.PreviewGroup>
            </Box>
        </Box>
    );
}
export default ImageGalleryV1;