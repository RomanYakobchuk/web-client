import React from "react";
import PropTypes from "prop-types";
import { colors, Box, Theme, useTheme } from "@mui/material";
import { styled } from "@mui/system";

const { grey } = colors;

interface NotchProps {
    notchWidth?: number;
}

const Notch = styled(Box)<NotchProps>(() => ({
    position: "absolute",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    visibility: "visible",
    top: 0,
    right: 0,
    left: 0,
}));

interface PullProps {
    notchWidth?: number;
}

const Pull = styled(Box)<PullProps>(({ notchWidth, theme }) => ({
    width: `var(--notch-width, ${notchWidth}vw)`,
    height: 6,
    backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
    borderRadius: 3,
    position: "absolute",
    top: `calc(12px + var(--bottomsheet-offset-top))`,
    left: "50%",
    transform: "translateX(-50%)",
}));

interface BottomSheetDefaultHeaderProps {
    notchWidth?: number;
}

const BottomSheetDefaultHeader: React.FC<BottomSheetDefaultHeaderProps> = ({ notchWidth }) => {
    const theme: Theme = useTheme();

    return (
        <Notch>
            <Pull notchWidth={notchWidth} theme={theme} />
        </Notch>
    );
};

BottomSheetDefaultHeader.propTypes = {
    /**
     * Custom notch width of the custom bottom sheet header
     */
    notchWidth: PropTypes.number,
};

export { BottomSheetDefaultHeader };
