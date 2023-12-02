import React, {FormEventHandler, ReactNode, useState} from "react";
import {Box, Button, Collapse, Grid, SxProps} from "@mui/material";
import {CloseSharp, FilterListSharp} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

type TProps = {
    children: ReactNode,
    style?: SxProps,
    onSubmit: FormEventHandler
}
const GridFilter = ({children, style, onSubmit}: TProps) => {

    const translate = useTranslate();

    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

    return (
        <Grid
            sx={{
                maxWidth: '550px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'start',
                ...style
            }}
            item>
            <Box>
                <Button
                    color={'secondary'}
                    variant={'contained'}
                    sx={{
                        textTransform: 'inherit',
                        color: 'common.black'
                    }}
                    endIcon={isOpenFilter ? <CloseSharp/> : <FilterListSharp/>}
                    onClick={() => setIsOpenFilter(!isOpenFilter)}
                >
                    {translate("buttons.filter")}
                </Button>
            </Box>
            <Collapse sx={{width: '100%'}} in={isOpenFilter}>
                <Box
                    component='form'
                    autoComplete='off'
                    onSubmit={onSubmit}
                    sx={{
                        // bgcolor: 'common.black',
                        display: 'flex',
                        p: 2,
                        // borderRadius: '15px',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                        // height: isOpenFilter ? '100%' : 0,
                        // transition: 'height 300ms linear, display 500ms linear '
                    }}
                >
                    {children}
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'end'
                    }}>
                        <Button
                            color={'info'}
                            sx={{
                                width: 'fit-content',
                                textTransform: 'inherit'
                            }}
                            variant="contained"
                            type={'submit'}
                        >
                            {translate("buttons.search")}
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </Grid>
    );
};
export default GridFilter
