import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import SpeedDial from '@mui/material/SpeedDial';
import SaveIcon from '@mui/icons-material/Save';
import {ReactNode, useState} from "react";
import {SxProps} from "@mui/material";
import Box from '@mui/material/Box';

const defaultActions = [
    {icon: <FileCopyIcon/>, name: 'Copy'},
    {icon: <SaveIcon/>, name: 'Save'},
    {icon: <PrintIcon/>, name: 'Print'},
    {icon: <ShareIcon/>, name: 'Share'},
];
type TActions = {
    icon: ReactNode,
    name: string
}
type TProps = {
    styleSx?: SxProps,
    actions?: TActions[]
}
export const SpeedDeal = ({styleSx, actions = defaultActions}: TProps) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box
            sx={{
                height: 320,
                transform: 'translateZ(0px)',
                flexGrow: 1,
                ...styleSx
            }}
        >
            <SpeedDial
                ariaLabel="SpeedDial controlled open example"
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    "& span.MuiSpeedDialAction-staticTooltipLabel": {
                        right: 'unset',
                        left: '100%',
                        width: 'fit-content',
                        // color: 'common.white',
                        // bgcolor: 'common.black'
                    }
                }}
                icon={<SpeedDialIcon/>}
                onClose={(_, reason) => {
                    if (reason === 'toggle') {
                        handleClose();
                    }
                }}
                onOpen={(_, reason) => {
                    if (reason === 'toggle') {
                        handleOpen();
                    }
                }}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        open={open}
                        key={action.name}
                        icon={action.icon}
                        tooltipOpen={true}
                        tooltipTitle={action.name}
                        onClick={handleClose}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}


