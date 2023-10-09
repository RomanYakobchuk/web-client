import {Box, Button, CircularProgress, FormControl, TextareaAutosize,} from "@mui/material";
import {EmojiEmotions, SendOutlined} from "@mui/icons-material";
import {useContext, useState} from "react";
import {ColorModeContext} from "../../../contexts";
import Picker, {EmojiStyle} from "emoji-picker-react";
import {useMobile} from "../../../hook";


interface IProps {
    value: string,
    setValue: any,
    handleSend: any,
}

const ReviewInput = ({value, setValue, handleSend}: IProps) => {
    const {mode} = useContext(ColorModeContext);

    const {device, width} = useMobile();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (event: any, emoji: any) => {
        setValue((prevValue: string) => prevValue + emoji.emoji)
    }
    return (
        <FormControl fullWidth sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: {xs: 1, md: 2},
            alignItems: "center",
            flex: 1,
            order: device ? 2 : 1
        }}>
            {
                device ? "" :
                    <Box sx={{
                        flex: 1,
                        position: 'relative'
                    }}>
                        <EmojiEmotions sx={{
                            fontSize: '30px',
                            transition: '300ms linear',
                            cursor: 'pointer',
                            color: showEmojiPicker ? 'blue' : mode === "dark" ? '#fcfcfc' : '#000',
                            "&:hover": {
                                color: 'blue'
                            }
                        }} onClick={handleEmojiPickerHideShow}/>
                        {
                            showEmojiPicker &&
                            <Box sx={{
                                position: 'absolute',
                                bottom: width < 1260 ? "60px" : 'unset',
                                left: width < 1260 ? "0" : 'unset',
                                right: width < 1260 ? "unset" : "0",
                                zIndex: 2000
                            }}>
                                <Picker emojiStyle={EmojiStyle.NATIVE}
                                        onEmojiClick={(emoji, event) => handleEmojiClick(event, emoji)}
                                />
                            </Box>
                        }
                    </Box>
            }
            <TextareaAutosize
                placeholder="Type something here…"
                minRows={3}
                value={value ?? ""}
                onChange={(e) => setValue(e.target.value)}
                style={{
                    flex: 8,
                    resize: 'vertical',
                    minHeight: '70px',
                    maxHeight: '170px',
                    height: '70px',
                    background: "transparent",
                    fontSize: "16px",
                    borderRadius: 6,
                    padding: 10,
                    color: mode === "dark" ? "#fcfcfc" : "#000",
                    borderColor: mode === "dark" ? "#fcfcfc" : "#000",
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flex: 1,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Button
                    onClick={handleSend}
                    sx={{
                        ml: 'auto',
                        bgcolor: '#1e36e8',
                        "&:hover": {
                            bgcolor: "#4f5cc3"
                        }
                    }}
                    variant={"contained"}>
                    <SendOutlined sx={{color: '#fcfcfc'}}/>
                </Button>
            </Box>
        </FormControl>
    );
};
export default ReviewInput
