import {Box} from "@mui/material";
import {useEffect} from "react";

const Create = () => {

    useEffect(() => {
        let hide = document.querySelector('.hide-text') as HTMLElement | null;

        function dots() {
            if (!hide) {
                hide = document.querySelector('.hide-text') as HTMLElement | null;
            }
            if (hide) {
                let dot = document.createElement('span');
                dot.className = 'dot-message';
                dot.style.top = hide.offsetHeight * Math.random() + "px";
                dot.style.left = hide.offsetWidth * Math.random() + "px";
                let size = Math.random() * 0.5;
                dot.style.height = size + "mm";
                dot.style.width = size + "mm";
                if (hide.children.length <= 300) {
                    hide.appendChild(dot);
                    setInterval(() => {
                        if (hide) {
                            dot.style.top = hide.offsetHeight * Math.random() + "px";
                            dot.style.left = hide.offsetWidth * Math.random() + "px";
                        }
                    }, 50)
                }
            }
        }

        for (let i = 0; i < 300; i++) {
            dots();
        }
    }, []);
    return (
        <Box
            className={'spoiler-text'}
            sx={{
                width: 'fit-content',
                height: 'fit-content',
                position: 'relative',
                // background: 'silver',
                "& .dot-message": {
                    position: 'absolute',
                    borderRadius: '50%',
                    bgcolor: 'silver'
                },
                ".text-spoiler": {
                    color: 'transparent'
                },
                "&:hover": {
                    ".text-spoiler": {
                        color: 'common.white'
                    },
                    ".hide-text": {
                        maxWidth: 0,
                        bgcolor: 'transparent'
                    }
                }
            }}
        >
            <Box
                className={'text-spoiler'}
                sx={{
                    fontSize: '20px',
                    // bgcolor: '#000'
                }}
            >
                CreateChat
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // bgcolor: '#000',
                    overflow: 'hidden'
                }}
                className={'hide-text'}/>
        </Box>
    );
};

export default Create;