import {Box, Button, SxProps} from "@mui/material";
import {MouseEvent, useState} from "react";
import {Apartment} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import {IEstablishment} from "@/interfaces/common";
import {TButtonVariant} from "@/interfaces/types";
import {BigPopoverVariant} from "./bigPopoverVariant";
import {SmallPopoverVariant} from "@/components/buttons/establishmentPopover/smallPopoverVariant";

type TProps = {
    establishment: IEstablishment,
    isShowIcon?: boolean,
    isShowText?: boolean,
    btnStyles?: SxProps,
    variantPopover?: "small" | "big",
    btnVariant?: TButtonVariant,
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
}
export const EstablishmentPopoverBtn = ({
                                            establishment,
                                            variantPopover = 'big',
                                            color = 'info',
                                            btnStyles,
                                            isShowIcon = true,
                                            isShowText = true,
                                            btnVariant = 'text'
                                        }: TProps) => {
    const translate = useTranslate();

    const [anchorElPopover, setAnchorElPopover] = useState<HTMLButtonElement | null>(null);

    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorElPopover(event.currentTarget)
    }
    const handleClosePopover = () => {
        setAnchorElPopover(null);
    }
    const openPopover = Boolean(anchorElPopover);
    const popoverId = openPopover ? 'establishment_popover' : undefined;

    const popoverByVariant = {
        small: <SmallPopoverVariant
            establishment={establishment}
            popoverId={popoverId}
            anchorElPopover={anchorElPopover}
            handleClosePopover={handleClosePopover}
            openPopover={openPopover}
        />,
        big: <BigPopoverVariant
            establishment={establishment}
            popoverId={popoverId}
            anchorElPopover={anchorElPopover}
            handleClosePopover={handleClosePopover}
            openPopover={openPopover}
        />
    }
    return (
        <Box>
            <Button
                variant={btnVariant}
                color={color}
                onClick={handleClickPopover}
                aria-describedby={popoverId}
                sx={{
                    textTransform: 'inherit',
                    borderRadius: '7px',
                    ...btnStyles
                }}
                startIcon={isShowIcon ? <Apartment/> : <></>}
            >
                {isShowText && translate('home.one')}
            </Button>
            {popoverByVariant[variantPopover]}
        </Box>
    );
};
