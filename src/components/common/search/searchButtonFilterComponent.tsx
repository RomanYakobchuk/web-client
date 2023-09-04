import {Box, Button, SxProps} from "@mui/material";
import React from "react";
import {useTranslate} from "@refinedev/core";


interface IProps {
    setOpenFilter: (value: boolean) => void,
    handleReplace: () => void,
    handleSearch: () => void,
    styleSx?: SxProps
}
const SearchButtonFilterComponent = ({setOpenFilter, handleReplace, handleSearch, styleSx}: IProps) => {

    const translate = useTranslate();

    const bRButtonFilter = '7px';
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            justifyContent: {xs: 'space-between', sm: 'start', md: 'end'},
            gap: 2,
            ...styleSx
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: 1
            }}>
                <Button
                    onClick={handleReplace}
                    color={"inherit"}
                    variant={"outlined"}
                    sx={{
                        width: '100%',
                        borderRadius: bRButtonFilter
                    }}
                >
                    {
                        translate("home.reset")
                    }
                </Button>
                <Button
                    sx={{
                        width: '100%',
                        borderRadius: bRButtonFilter
                    }}
                    color={"error"}
                    variant={"contained"}
                    onClick={() => {
                        setOpenFilter(false)
                    }}
                >
                    {translate("buttons.close")}
                </Button>
            </Box>
            <Button
                variant={"contained"}
                color={"info"}
                sx={{
                    width: '100%',
                    borderRadius: bRButtonFilter
                }}
                onClick={handleSearch}>
                {translate("buttons.search")}
            </Button>
        </Box>
    );
};
export default SearchButtonFilterComponent
