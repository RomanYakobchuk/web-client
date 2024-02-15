import {Box} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {Pagination} from "antd";


interface IProps {
    current: number,
    setCurrent: Dispatch<SetStateAction<number>>,
    pageCount: number,
    setPageSize: Dispatch<SetStateAction<number>>,
    count: number
}

const PaginationComponent = ({current, setCurrent, pageCount, setPageSize, count}: IProps) => {

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                "& *": {
                    color: 'common.white'
                },
                mt: 3,
                "& button, & a": {
                    fontSize: '20px !important'
                },
                "& li.ant-pagination-item:not(.ant-pagination-item-active) > a, li.ant-pagination-next, li.ant-pagination-prev": {
                    color: 'common.white',
                },
                "& .ant-pagination li.ant-pagination-item": {
                    transition: '300ms linear',
                    "&:hover": {
                        bgcolor: 'cornflowerblue',
                        borderRadius: '6px'
                    }
                },
                "& li.ant-pagination-item.ant-pagination-item-active": {
                    bgcolor: 'cornflowerblue',
                    border: 'unset',
                    "& a": {
                        color: 'white',
                    },
                },
                "& .ant-pagination li.ant-pagination-next, li.ant-pagination-prev": {
                    bgcolor: 'modern.modern_2.main',
                    "& button": {
                        color: 'common.white',
                        display: 'flex !important',
                        alignItems: 'center !important',
                        justifyContent: 'center !important'
                    }
                },
                "& div.ant-select-selector span, & li.ant-pagination-options div.ant-select-dropdown div.ant-select-item-option-content": {
                    color: '#000'
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
