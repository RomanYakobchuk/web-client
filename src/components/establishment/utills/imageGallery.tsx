import {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {useMobile} from "../../../utils";
import {PermMediaOutlined} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import ImageSlider from "../../common/imageSlider";

interface PlaceGalleryProps {
    photos: any
}

const PlaceGallery = ({photos}: PlaceGalleryProps) => {
    const {width, device} = useMobile();
    const translate = useTranslate();

    const [selectedSlideNumber, setSelectedSlideNumber] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const height = width < 600 ? '208px' : width < 900 ? '308px' : width < 1200 ? '408px' : '458px';
    const height1 = '100%';
    const height2 = width < 600 ? '100px' : width < 900 ? '150px' : width < 1200 ? '200px' : '225px';


    const handleOpen = (i: number) => {
        setSelectedSlideNumber(i)
        setShowAllPhotos(true)
    }
    return (
        <Box sx={{position: "relative", width: '100%', height}}>
            <Box
                sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: "2fr 1fr",
                    borderRadius: "20px",
                    overflow: "hidden",
                    height
                }}
            >
                <Box>
                    {photos[0] && (
                        <Box sx={{
                            height
                        }}>
                            <img
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
                        <img
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
                        <img
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
            </Box>
            <Button
                onClick={() => setShowAllPhotos(true)}
                sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px gray",
                    bgcolor: "white",
                    "&:hover": {
                        bgcolor: '#fbf6f6'
                    }
                }}
            >
                <PermMediaOutlined sx={{
                    color: 'black'
                }}/>
            </Button>
            {
                showAllPhotos && (
                    <ImageSlider
                        selectedSlideNumber={selectedSlideNumber}
                        images={photos}
                        open={showAllPhotos}
                        setOpen={setShowAllPhotos}
                        modalTitle={
                            <Typography variant="h5" sx={{mb: 2}}>
                                {translate('pictures.pictures')}
                            </Typography>
                        }
                    />
                )
            }
        </Box>
    );
}
export default PlaceGallery;