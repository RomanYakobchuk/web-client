import {Box, SxProps} from "@mui/material";
import React, {ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useTranslate} from "@refinedev/core";

import {useMobile} from "../../../hook";
import {ColorModeContext} from "../../../contexts";
import ModalShowContent from "../../window/modalShowContent";

type TProps = {
    children: ReactNode,
    defaultHeight: string,
    maxWindowWidth?: number,
    propsForFollow?: string | ReactNode | number,
    style?: SxProps,
    isShowFull?: boolean
}
const ObserverComponent = ({children, defaultHeight, maxWindowWidth = 1200, propsForFollow, style, isShowFull = false}: TProps) => {
    const {width, device} = useMobile();
    const defaultChildrenHeight = `calc(${defaultHeight} - 50px)`;
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const contentRef = useRef<HTMLDivElement>(null);
    const [isContentTrimmed, setIsContentTrimmed] = useState(false);


    const [containerHeight, setContainerHeight] = useState<'100%' | typeof defaultHeight>(defaultHeight);
    const [openFull, setOpenFull] = useState<boolean>(false);
    const [openFullModal, setOpenFullModal] = useState<boolean>(false);

    useEffect(() => {
        const container = contentRef.current;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newHeight = entry.target.scrollHeight;
                console.log('newHeight: ', newHeight)
                const containerHeight = entry.target.clientHeight;
                console.log('containerHeight: ', containerHeight)

                if (newHeight > containerHeight && isContentTrimmed) {
                    setIsContentTrimmed(false)
                } else if (newHeight <= containerHeight && !isContentTrimmed) {
                    setIsContentTrimmed(true)
                }
            }
        });

        if (container) {
            resizeObserver.observe(container);
        }

        return () => {
            if (container) {
                resizeObserver.unobserve(container);
            }
        };
    }, [width, device, openFull, openFullModal, contentRef.current, propsForFollow, defaultHeight]);
    const handleShowFull = () => {
        if (width < maxWindowWidth) {
            setContainerHeight(containerHeight === defaultHeight ? '100%' : defaultHeight)
            setOpenFull((prevState) => !prevState)
        } else {
            setOpenFullModal((prevState) => !prevState)
        }
    }

    useEffect(() => {
        if (width > maxWindowWidth) {
            setContainerHeight(defaultHeight)
            setOpenFull(false)
        } else {
            setOpenFullModal(false)
        }
    }, [width, isContentTrimmed, maxWindowWidth]);

    return (
        <Box
            sx={{
                borderRadius: '15px',
                p: '15px',
                overflow: 'hidden',
                maxHeight: isShowFull ? '100%' : containerHeight,
                position: 'relative',
                height: '100%',
                transition: 'max-height 300ms linear',
                color: 'common.white',
                bgcolor: mode === 'dark' ? '#3b93a7' : '#f39c7d',
                ...style
            }}>
            <Box
                ref={contentRef}
                sx={{
                    maxHeight: isShowFull ? 'auto' : containerHeight === '100%' ? 'auto' : defaultChildrenHeight,
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'max-height 300ms linear',
                    mb: '15px'
                }}
            >
                {children}
            </Box>
            {
                !isContentTrimmed && !openFull &&
                <ModalShowContent
                    setIsOpen={setOpenFullModal}
                    isOpen={openFullModal}
                    openComponent={
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '7px',
                                textTransform: 'lowercase',
                                cursor: 'pointer'
                            }}
                            onClick={handleShowFull}
                        >
                            {translate('buttons.more') + '...'}
                        </Box>
                    }>
                    {
                        !isContentTrimmed && children
                    }
                </ModalShowContent>
            }
            {
                openFull &&
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '7px',
                        textTransform: 'lowercase',
                        cursor: 'pointer',
                    }}
                    onClick={handleShowFull}
                >
                    {'...' + translate('buttons.hide')}
                </Box>
            }
        </Box>
    );
};
export default ObserverComponent
