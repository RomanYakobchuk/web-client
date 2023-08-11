import {Box, Button, MenuItem, Select} from "@mui/material";
import {ArrowBackIosNew, ArrowForwardIos} from "@mui/icons-material";
import React, {useContext, useState} from "react";
import {useTranslate} from "@refinedev/core";
import {Pagination} from "antd";
import type {PaginationProps} from "antd";

import {useMobile} from "../../utils";
import {selectStyle} from "../../styles";
import {ColorModeContext} from "../../contexts";


interface IProps {
    current: number,
    setCurrent: any,
    pageCount: number,
    setPageSize: any,
    count: number
}

const PaginationComponent = ({current, setCurrent, pageCount, setPageSize, count}: IProps) => {

    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext)
    const translate = useTranslate();

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: mode === 'dark' ? "#242539" : '#8a91c7',
                p: "10px",
                borderRadius: '20px',
                mt: 3,
                "& ul.ant-pagination": {
                    display: 'flex',
                    alignItems: "center",
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center'
                },
                "& ul.ant-pagination .ant-pagination-options": {
                    display: 'inline-block'
                },
                "& li.ant-pagination-options > div > div.ant-select-selector span, & li.ant-pagination-options > div > span": {
                    color: mode === 'dark' ? "#fcfcfc" : "#000",
                },
                "& li.ant-pagination-item, li.ant-pagination-next, li.ant-pagination-prev, li.ant-pagination-options > div > div.ant-select-selector": {
                    minWidth: '40px',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: mode === 'dark' ? "#41436a" : '#fff',
                    "& a, button": {
                        color: mode === 'dark' ? "#fcfcfc" : "#000",
                    },
                    border: `1px solid transparent`,
                    "&:hover": {
                        bgcolor: 'normal',
                        scale: 1.2,
                        border: '1px solid #ee29fb',
                    },
                },
                "& li.ant-pagination-disabled": {
                    "&:hover": {
                        border: '1px solid transparent',
                    }
                },
                "& li.ant-pagination-item-active": {
                    bgcolor: mode === 'dark' ? "darkviolet" : "blueviolet",
                    borderColor: 'transparent', //darkorchid
                    "& a": {
                        color: '#fcfcfc',
                        "&:hover": {
                            color: '#fcfcfc'
                        }
                    },
                }
            }}
        >
            <Pagination
                showSizeChanger={true}
                onShowSizeChange={(onCurrent, onSize) => {
                    setCurrent(onCurrent)
                    setPageSize(onSize)
                }}
                onChange={(page, pageSize) => {
                    setCurrent(page)
                    setPageSize(pageSize)
                }}
                current={current}
                pageSize={pageCount}
                total={count}
                style={{}}

            />
            {/*<Button*/}
            {/*    disabled={!(current > 1)}*/}
            {/*    color={"info"}*/}
            {/*    variant={"contained"}*/}
            {/*    size={'small'}*/}
            {/*    onClick={() => setCurrent((prev: any) => prev - 1)}*/}
            {/*>*/}
            {/*    <ArrowBackIosNew sx={{color: '#fcfcfc'}}/>*/}
            {/*</Button>*/}
            {/*<Box display={{xs: 'hidden', sm: 'flex'}} fontSize={{xs: '14px', sm: '16px'}} alignItems={"center"}*/}
            {/*     gap={"5px"}>*/}
            {/*    {translate("home.pages.page")}{` `}<strong>{current} {translate("home.pages.of")} {pageCount}</strong>*/}
            {/*</Box>*/}
            {/*<Button*/}
            {/*    disabled={current === pageCount || pageCount === 0}*/}
            {/*    color={"info"}*/}
            {/*    variant={"contained"}*/}
            {/*    size={'small'}*/}
            {/*    onClick={() => setCurrent((prev: any) => prev + 1)}*/}
            {/*>*/}
            {/*    <ArrowForwardIos sx={{color: '#fcfcfc'}}/>*/}
            {/*</Button>*/}
            {/*<Select variant={"outlined"}*/}
            {/*        disabled={pageCount === 0}*/}
            {/*        sx={{*/}
            {/*            fontSize: {xs: '14px', sm: '16px'},*/}
            {/*            ...selectStyle*/}
            {/*        }}*/}
            {/*        size={'small'}*/}
            {/*        color={"info"}*/}
            {/*        displayEmpty required*/}

            {/*        inputProps={{'aria-label': 'Without label'}} defaultValue={10}*/}
            {/*        onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}>*/}
            {/*    {*/}
            {/*        [10, 20, 30, 40, 50].map((size) => (*/}
            {/*            <MenuItem key={size} sx={{*/}
            {/*                fontSize: '16px'*/}
            {/*            }} value={size}>{width > 500 && translate("home.pages.show")} {size}</MenuItem>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</Select>*/}
        </Box>
    );
};
export default PaginationComponent