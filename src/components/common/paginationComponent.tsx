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
                "& *":{
                    color: 'common.white'
                },
                // // bgcolor: mode === 'dark' ? "#323349" : '#6e76b3',
                // p: "10px",
                // borderRadius: '10px',
                mt: 3,
                "& button, & a":{
                    fontSize: '20px !important'
                },
                // "& ul.ant-pagination": {
                //     display: 'flex',
                //     alignItems: "center",
                //     flexWrap: 'wrap',
                //     gap: 1,
                //     justifyContent: 'center'
                // },
                // "& ul.ant-pagination .ant-pagination-options": {
                //     display: 'inline-table',
                // },
                // "& li.ant-pagination-options > div > div.ant-select-selector span": {
                //     color: 'common.white',
                //     // bgcolor: 'common.white'
                // },
                "& li.ant-pagination-item:not(.ant-pagination-item-active) > a, li.ant-pagination-next, li.ant-pagination-prev":{
                    color: 'common.white'
                },
               "& div.ant-select-selector span, & li.ant-pagination-options div.ant-select-dropdown div.ant-select-item-option-content":{
                    color: '#000'
                }
                // "& li.ant-pagination-item, li.ant-pagination-next, li.ant-pagination-prev, li.ant-pagination-options > div > div.ant-select-selector": {
                //     minWidth: '40px',
                //     height: '40px',
                //     display: 'flex',
                //     justifyContent: 'center',
                //     alignItems: 'center',
                //     bgcolor: mode === 'dark' ? "#41436a" : '#fff',
                //     "& a, button": {
                //         color: mode === 'dark' ? "#fcfcfc" : "#000",
                //     },
                //     border: `1px solid transparent`,
                //     "&:hover": {
                //         bgcolor: 'normal',
                //         scale: 1.2,
                //         border: '1px solid #ee29fb',
                //     },
                // },
                // "& li.ant-pagination-disabled": {
                //     "&:hover": {
                //         border: '1px solid transparent',
                //     }
                // },
                // "& li.ant-pagination-item-active": {
                //     bgcolor: mode === 'dark' ? "darkviolet" : "blueviolet",
                //     borderColor: 'transparent', //darkorchid
                //     "& a": {
                //         color: '#fcfcfc',
                //         "&:hover": {
                //             color: '#fcfcfc'
                //         }
                //     },
                // }
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
                style={{
                }}
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
