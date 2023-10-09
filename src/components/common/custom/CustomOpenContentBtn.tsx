import {ReactNode, useState, useContext, useEffect} from "react";
import {Box, Button, SxProps} from "@mui/material";
import {Add, Remove} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../../contexts";

interface IProps {
    children: ReactNode,
    openEndIcon?: ReactNode,
    openText?: string | ReactNode,
    openComponent?: boolean,
    closeEndIcon?: ReactNode,
    closeText?: string | ReactNode,
    style?: SxProps
}

const CustomOpenContentBtn = ({children, openEndIcon, closeEndIcon, openText, closeText, style, openComponent}: IProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(openComponent as boolean)
    }, [openComponent]);
    const handleChangeIsOpen = () => {
        setOpen((prevState) => !prevState);
    }

    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: '5px',
                bgcolor: 'common.black',
                boxShadow: `0px 0px 5px 1px ${mode === 'dark' ? "#1d1d1d" : "#f1f1f1"}`,
                "& button.handle-change-open-state": {
                    textTransform: 'inherit',
                    bgcolor: 'transparent',
                    justifyContent: 'space-between',
                    color: open ? 'error.main' : 'success.main',
                    width: '100%',
                    "&:hover": {
                        bgcolor: 'background.paper',
                        color: open ? 'error.main' : 'success.main',
                    }
                },
                ...style
            }}
        >
            <Button
                className={'handle-change-open-state'}
                endIcon={open ? (closeEndIcon ? closeEndIcon : <Remove/>) : (openEndIcon ? openEndIcon : <Add/>)}
                onClick={handleChangeIsOpen}
            >
                {
                    open ? (
                        closeText ? closeText : translate('buttons.undo')
                    ) : (
                        openText ? openText : translate('buttons.add')
                    )
                }
            </Button>
            {
                open && (
                    <Box sx={{
                        transition: 'height 0.3s ease-in-out',
                        height: open ? 'auto' : '0',
                        overflow: 'hidden',
                        p: '5px'
                    }}>
                        {children}
                    </Box>
                )
            }
        </Box>
    );
};
export default CustomOpenContentBtn;
