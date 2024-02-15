import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";
import {grey} from "@mui/material/colors";

const Root = styled('div')(() => ({
    height: '100%',
    zIndex: 150,
    position: 'relative',
}));
const StyledBox = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({theme}) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const drawerBleeding = 28;


export {
    Root,
    Puller,
    drawerBleeding,
    StyledBox
}

export type Anchor = "left" | "bottom" | "right" | "top";
