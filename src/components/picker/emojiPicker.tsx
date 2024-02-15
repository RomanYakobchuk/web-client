import React, {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {SentimentSatisfiedAltSharp} from "@mui/icons-material";
import Picker, {EmojiStyle} from "emoji-picker-react";
import {Box, SxProps} from "@mui/material";

import {ColorModeContext} from "@/contexts";

type TProps = {
    value?: string,
    setValue: Dispatch<SetStateAction<string>>,
    styleSx?: SxProps,
    emojiIconSx?: SxProps,
    position?: "left" | "right"
}
export const EmojiPicker = ({value, setValue, styleSx, emojiIconSx, position = "left"}: TProps) => {
    const {mode} = useContext(ColorModeContext);

    const showPickerRef = useRef<HTMLDivElement | null>(null)

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const handleEmojiPickerHideShow = (event: React.MouseEvent) => {
        if (event.target) {
            event.stopPropagation();
            if (showPickerRef.current && showPickerRef.current?.contains(event.target as Node)) {
                return;
            }
            setShowEmojiPicker(!showEmojiPicker);
        }
    }

    const handleEmojiClick = (_: any, emoji: any) => {
        setValue((prevValue: string) => prevValue + emoji.emoji)
    }

    useEffect(() => {
        function clickOutside(event: MouseEvent) {
            if (event.target && showEmojiPicker) {
                if (showPickerRef.current && !showPickerRef.current?.contains(event.target as Node)) {
                    setShowEmojiPicker(false)
                }
            }
        }

        document.addEventListener('click', clickOutside)

        return () => {
            document.removeEventListener('click', clickOutside)
        }
    }, [showPickerRef, showEmojiPicker]);

    const positionChange = {
        left: {
            left: 0
        },
        right: {
            right: 0
        }
    }
    const positionStyle = positionChange[position];
    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            // borderRadius: '3px 3px 3px 15px',
            // bgcolor: 'common.black',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'fit-content',
            width: 'fit-content'
        }}>
            <SentimentSatisfiedAltSharp sx={{
                fontSize: '30px',
                transition: '300ms linear',
                cursor: 'pointer',
                color: showEmojiPicker ? 'blue' : mode === "dark" ? '#fcfcfc' : '#000',
                "&:hover": {
                    color: 'blue'
                },
                ...emojiIconSx
            }} onClick={handleEmojiPickerHideShow}/>
            {
                showEmojiPicker &&
                <Box
                    ref={showPickerRef}
                    sx={{
                        position: 'absolute',
                        top: '60px',
                        zIndex: 2000,
                        ...positionStyle,
                        ...styleSx
                    }}>
                    <Picker
                        emojiStyle={EmojiStyle.NATIVE}
                        onEmojiClick={(emoji, event) => handleEmojiClick(event, emoji)}
                    />
                </Box>
            }
        </Box>
    );
};

