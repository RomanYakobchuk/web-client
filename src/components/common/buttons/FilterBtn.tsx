import {FilterList} from "@mui/icons-material";
import {Button, SxProps} from "@mui/material";
import React from "react";
import {useTranslate} from "@refinedev/core";

interface IProps {
    setOpenFilter: (value: boolean) => void,
    filterLength: number,
    isShowAllFilters: boolean,
    btnStyle?: SxProps
}
const FilterBtn = ({setOpenFilter, filterLength, isShowAllFilters, btnStyle}: IProps) => {
    const translate = useTranslate();

    const bRButtonFilter = '7px';

    return (
        <Button
            variant={'contained'}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                color: 'common.black',
                bgcolor: 'common.white',
                "&:hover": {
                    color: 'common.black',
                    bgcolor: 'common.white'
                },
                height: '40px',
                textTransform: 'unset',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: bRButtonFilter,
                ...btnStyle
            }}
            onClick={() => setOpenFilter(true)}
            size={'small'}
        >
            <FilterList sx={{
                width: '25px',
                height: '25px'
            }}/>
            {
                isShowAllFilters ? (
                    translate('buttons.moreFilter')
                ) : (
                    `${filterLength} ${translate('buttons.filtersApplied')}`
                )
            }
        </Button>
    );
};
export default FilterBtn
