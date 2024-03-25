import {useTranslate} from "@refinedev/core";
import React, {useState, MouseEvent, useRef, useEffect, ReactNode} from "react";
import {Box, Button, Popover, SxProps} from "@mui/material";

import {KeyboardArrowDownRounded, KeyboardArrowUpRounded} from '@mui/icons-material';

type TProps = {
    text?: string,
    icon?: ReactNode,
    isShowIcon?: boolean,
    buttonStyles?: SxProps,
    childrenStyles?: SxProps,
    children: ReactNode,
    isShowSearchButton?: boolean,
    handleSearch?: () => void,
}
export const CustomSelectPopover = ({
                                        buttonStyles,
                                        handleSearch,
                                        isShowSearchButton = false,
                                        childrenStyles,
                                        children,
                                        text,
                                        isShowIcon = true,
                                        icon
                                    }: TProps) => {
    const translate = useTranslate();

    const clipPathRef = useRef<null | HTMLDivElement>(null);

    const [clipPathX, setClipPathX] = useState<string>(clipPathRef?.current?.parentElement?.style.transformOrigin?.split(" ")[0] || '65px');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'selectAverageCheck' : undefined;

    const xOrigin = () => {
        const w = clipPathRef?.current?.parentElement?.style.transformOrigin;
        return w?.split(" ")[0];
    }
    useEffect(() => {
        let x: string | undefined = undefined;
        if (open) {
            x = xOrigin();
            if (!x) {
                x = xOrigin();
            }
            setClipPathX(x as string);
        }
    }, [clipPathRef?.current, open]);

    const search = () => {
        if (isShowSearchButton && handleSearch) {
            handleSearch();
            handleClose();
        }
    }
    return (
        <>
            <Button
                variant={'outlined'}
                color={'secondary'}
                onClick={handleClick}
                sx={{
                    textTransform: 'inherit',
                    borderRadius: '7px',
                    ...buttonStyles
                }}
                endIcon={isShowIcon ? (icon || (open ? <KeyboardArrowUpRounded/> :
                    <KeyboardArrowDownRounded/>)) : <></>}
            >
                {text || translate('home.create.averageCheck')}
            </Button>
            <Popover
                elevation={0}
                open={open}
                id={id}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                sx={{
                    "& div.MuiPaper-root": {
                        bgcolor: 'transparent',
                        transform: 'translateY(-10px) !important',
                        filter: 'url(#flt_tag) drop-shadow(0px 0px 3px #7a7a7a)'
                    },
                    "& .flt_svg": {
                        visibility: 'hidden',
                        position: 'absolute',
                        width: '0px',
                        height: '0px'
                    }
                }}
            >
                <svg className="flt_svg" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="flt_tag">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                                           result="flt_tag"/>
                            <feComposite in="SourceGraphic" in2="flt_tag" operator="atop"/>
                        </filter>
                    </defs>
                </svg>
                <Box
                    ref={clipPathRef}
                    sx={{
                        p: 2,
                        pt: 4,
                        // clipPath: 'polygon(0 15px, 7% 16%, 10% 0%, 13% 16%, 100% 15px, 100% 100%, 0% 100%)',
                        clipPath: `polygon(0 25px, ${clipPathX} 25px, calc(${clipPathX} + 10px) -10px, calc(${clipPathX} + 20px) 25px, 100% 25px, 100% 100%, 0% 100%)`,
                        bgcolor: 'common.black',
                        ...childrenStyles
                    }}
                >
                    {children}
                    {
                        isShowSearchButton && (
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'end',
                                }}
                            >
                                <Button
                                    variant={"contained"}
                                    color={"info"}
                                    sx={{
                                        textTransform: 'inherit',
                                        borderRadius: '7px'
                                    }}
                                    onClick={search}>
                                    {translate("buttons.search")}
                                </Button>
                            </Box>
                        )
                    }
                </Box>
            </Popover>
        </>
    );
};

