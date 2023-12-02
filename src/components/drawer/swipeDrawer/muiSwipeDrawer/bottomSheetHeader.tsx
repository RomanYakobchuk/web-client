import React from "react";
import PropTypes from "prop-types";
import {
    Box,
    Stack,
    ToggleButton,
    IconButton,
    Theme,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {
    ExpandLess as ExpandIcon,
    Close as CloseIcon,
    SwipeVertical as DragIcon,
} from "@mui/icons-material";
import { TOGGLE, DRAGGABLE, CLOSE } from "./actions";

type BottomSheetHeaderProps = {
    isDraggable?: boolean;
    actions?: string[];
    expand?: boolean;
    onToggleClick?: () => void;
    onDragToggle?: () => void;
    onCloseClick?: () => void;
};

// const contains = (...args: any[]): boolean => Array.prototype.includes.call(...args);
const contains = (arr: any[], ...values: any[]): boolean => {
    return values.every(value => arr.includes(value));
};

const ExpandToggle = styled((props: any) => {
    const { expand, ...rest } = props;
    return <IconButton {...rest} />;
})(({ theme, expand }: { theme: Theme; expand: boolean }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Drag = styled((props: any) => {
    const { ...rest } = props;
    return <ToggleButton {...rest} />;
})({
    borderRadius: 99,
});

const Close = styled((props: any) => {
    const { ...rest } = props;
    return <IconButton {...rest} />;
})({
    marginLeft: "8px",
});

const Left = styled(Box)({
    flex: 1,
});

const Right = styled(Box)({
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
});

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
                                                                 isDraggable = false,
                                                                 actions = [],
                                                                 expand,
                                                                 onToggleClick,
                                                                 onDragToggle,
                                                                 onCloseClick,
                                                             }) => {
    return (
        <Stack
            sx={{
                margin: 1,
            }}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
        >
            <Left>
                {contains(actions, TOGGLE) ? (
                    <ExpandToggle
                        expand={expand}
                        onClick={onToggleClick}
                        disabled={isDraggable}
                    >
                        <ExpandIcon />
                    </ExpandToggle>
                ) : null}
            </Left>
            <Right>
                {contains(actions, DRAGGABLE) ? (
                    <Drag value="draggable" selected={isDraggable} onClick={onDragToggle}>
                        <DragIcon />
                    </Drag>
                ) : null}
                {contains(actions, CLOSE) ? (
                    <Close onClick={onCloseClick}>
                        <CloseIcon
                            sx={{
                                width: "2rem",
                            }}
                        />
                    </Close>
                ) : null}
            </Right>
        </Stack>
    );
};

BottomSheetHeader.propTypes = {
    isDraggable: PropTypes.bool,
    actions: PropTypes.array,
    expand: PropTypes.bool,
    onToggleClick: PropTypes.func,
    onDragToggle: PropTypes.func,
    onCloseClick: PropTypes.func,
};

export { BottomSheetHeader };
