import {IPicture} from "../../interfaces/common";
import {ReactNode, useEffect, useState} from "react";
import {ModalWindow} from "../index";
import {Box, Button, IconButton, Typography} from "@mui/material";
import {ArrowBackIos, ArrowBackIosNew, ArrowForwardIos, Close} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

type IProps = {
    images: IPicture[],
    open: boolean,
    setOpen: (value: boolean) => void,
    modalTitle: ReactNode,
    selectedSlideNumber: number
}
const ImageSlider = ({images, open, setOpen, modalTitle, selectedSlideNumber}: IProps) => {
    const translate = useTranslate();
    const [slideNumber, setSlideNumber] = useState(0)
    const handleMove = (direction: "r" | "l") => {
        let newSlideNumber;
        if (direction === 'l') {
            newSlideNumber = slideNumber === 0 ? images?.length - 1 : slideNumber - 1;
        } else {
            newSlideNumber = slideNumber === images?.length - 1 ? 0 : slideNumber + 1;
        }

        setSlideNumber(newSlideNumber)
    }
    useEffect(() => {
        if (selectedSlideNumber) {
            setSlideNumber(selectedSlideNumber)
        }
    }, [selectedSlideNumber]);
    return (
        <>
            <ModalWindow
                open={open}
                setOpen={setOpen}
                title={modalTitle}
                contentProps={{
                    maxWidth: '90%',
                    height: '90vh',
                    bgcolor: 'transparent',
                    "& header": {
                        p: '0 !important',
                        "& > button": {
                            p: '5px 10px',
                            bgcolor: '#f5f0f0',
                            borderRadius: '7px',
                            color: '#17171f'
                        }
                    },
                }}
                bodyProps={{
                    maxWidth: '100%',
                    maxHeight: '70vh'
                }}
            >
                <Box
                    sx={{
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        color: "white",
                        height: "100%",
                        gap: 2,
                        width: '100%',
                        display: "flex",
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: 'center',
                        justifyContent: 'center',
                        "& svg": {
                            fontSize: {sm: '40px'}
                        }
                    }}
                >
                    <Button
                        variant={'outlined'}
                        color={'secondary'}
                        sx={{
                            minWidth: '40px',
                            p: {sm: '0'},
                            width: {xs: '100%', sm: '50px'}
                        }}
                        onClick={() => handleMove("l")}
                    >
                        <ArrowBackIosNew/>
                    </Button>
                    <Box sx={{
                        maxWidth: '100%',
                        width: '100%',
                        height: {xs: 'unset', sm: '90%'},
                        maxHeight: {xs: '70%', sm: '90%'},
                        "& img": {
                            height: {xs: 'unset', sm: '100%'},
                            maxHeight: '100%',
                        }
                    }}>
                        <img
                            style={{
                                width: '100%',
                                objectFit: 'contain'
                            }}
                            src={images[slideNumber].url} alt=""/>
                    </Box>
                    <Button
                        variant={'outlined'}
                        color={'secondary'}
                        sx={{
                            minWidth: '40px',
                            p: {sm: '0'},
                            width: {xs: '100%', sm: '50px'}
                        }}
                        onClick={() => handleMove("r")}
                    >
                        <ArrowForwardIos/>
                    </Button>
                </Box>
            </ModalWindow>
        </>
    );
};
export default ImageSlider
