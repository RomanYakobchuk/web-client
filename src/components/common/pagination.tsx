import {Box, Button, MenuItem, Select} from "@mui/material";
import {ArrowBackIosNew, ArrowForwardIos} from "@mui/icons-material";
import React from "react";
import {useTranslate} from "@refinedev/core";
import {useMobile} from "../../utils";
import {selectStyle} from "../../styles";


interface IProps {
    current: number,
    setCurrent: any,
    pageCount: number,
    setPageSize: any
}

const Pagination = ({current, setCurrent, pageCount, setPageSize}: IProps) => {

    const {width} = useMobile();
    const translate = useTranslate();
    return (
        <Box display={"flex"} gap={2} mt={3} flexWrap={"wrap"}>
            <Button
                disabled={!(current > 1)}
                color={"info"}
                variant={"contained"}
                size={'small'}
                onClick={() => setCurrent((prev: any) => prev - 1)}
            >
                <ArrowBackIosNew sx={{color: '#fcfcfc'}}/>
            </Button>
            <Box display={{xs: 'hidden', sm: 'flex'}} fontSize={{xs: '14px', sm: '16px'}} alignItems={"center"}
                 gap={"5px"}>
                {translate("home.pages.page")}{` `}<strong>{current} {translate("home.pages.of")} {pageCount}</strong>
            </Box>
            <Button
                disabled={current === pageCount || pageCount === 0}
                color={"info"}
                variant={"contained"}
                size={'small'}
                onClick={() => setCurrent((prev: any) => prev + 1)}
            >
                <ArrowForwardIos sx={{color: '#fcfcfc'}}/>
            </Button>
            <Select variant={"outlined"}
                    disabled={pageCount === 0}
                    sx={{
                        fontSize: {xs: '14px', sm: '16px'},
                        ...selectStyle
                    }}
                    size={'small'}
                    color={"info"}
                    displayEmpty required

                    inputProps={{'aria-label': 'Without label'}} defaultValue={10}
                    onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}>
                {
                    [10, 20, 30, 40, 50].map((size) => (
                        <MenuItem key={size} sx={{
                            fontSize: '16px'
                        }} value={size}>{width > 500 && translate("home.pages.show")} {size}</MenuItem>
                    ))
                }
            </Select>
        </Box>
    );
};
export default Pagination
