import {useState} from "react";
import {Box, Button, StyledEngineProvider, Typography} from "@mui/material";
import {useMobile} from "../../../utils";
import {Close, PermMediaOutlined} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import ScrollLock from 'react-scrolllock';

interface PlaceGalleryProps {
    photos: any
}

const PlaceGallery = ({photos}: PlaceGalleryProps) => {
    const {width, device} = useMobile();
    const translate = useTranslate();

    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const height = width < 600 ? '208px' : width < 900 ? '308px' : width < 1200 ? '408px' : '458px';
    const height1 = '100%';
    const height2 = width < 600 ? '100px' : width < 900 ? '150px' : width < 1200 ? '200px' : '225px';


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
                                onClick={() => setShowAllPhotos(true)}
                                style={{
                                    cursor: "pointer",
                                    width: '100%',
                                    // aspectRatio: "square",
                                    objectFit: "cover",
                                    height: height1
                                }}
                                src={photos[0]}
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
                            onClick={() => setShowAllPhotos(true)}
                            style={{
                                cursor: "pointer",
                                // aspectRatio: "square",
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
                            onClick={() => setShowAllPhotos(true)}
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
                showAllPhotos &&
                <Box
                    sx={{
                        WebkitBackfaceVisibility: 'hidden',
                        position: "fixed",
                        backfaceVisibility: 'hidden',
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.75)",
                        color: "white",
                        height: "100%",
                        minHeight: '100vh',
                        p: 8,
                        gap: 4,
                        overflow: 'auto',
                        width: '100%',
                        zIndex: {xs: 200},
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: 'center',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }}
                >
                    <Box>
                        <Typography variant="h5" sx={{mb: 2}}>
                            {translate('pictures.pictures')}
                        </Typography>
                        <Button
                            onClick={() => setShowAllPhotos(false)}
                            variant="contained"
                            sx={{
                                position: "fixed",
                                right: "15px",
                                zIndex: 201,
                                top: '15px',
                                borderRadius: "10px",
                                boxShadow: "0 0 2px black",
                                bgcolor: "white",
                                color: "black",
                            }}
                        >
                            <Close/>
                        </Button>
                    </Box>
                    {
                        photos?.length > 0 &&
                        photos?.map((photo: any, index: number) => (
                            <Box key={index} sx={{
                                maxWidth: '700px'
                            }}>
                                <img
                                    style={{
                                        width: '100%',
                                    }}
                                    src={photo?.url ? photo?.url : photo} alt=""/>
                            </Box>
                        ))}
                </Box>
            }
        </Box>
    );
}
export default PlaceGallery;