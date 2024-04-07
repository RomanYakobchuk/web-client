import {Button, ButtonGroup, SxProps} from "@mui/material";
import React, {Dispatch, useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "@/contexts";
import {SetFilterType} from "@/interfaces/types";

type TArrayType = {
    title: string,
    value: string
}

interface IProps<T> {
    defaultSetFilters?: SetFilterType,
    setFilters?: SetFilterType,
    type: string,
    isShowAllFilters?: boolean,
    setType: (value: T) => void,
    styleSx?: SxProps,
    fieldName?: string,
    setCurrent?: Dispatch<React.SetStateAction<number>>,
    sortTranslatePath?: string,
    arrayType?: TArrayType[]
}

const establishmentType = [
    {
        title: 'all',
        value: '' as ""
    },
    {
        title: 'restaurant',
        value: 'restaurant' as "restaurant"
    },
    {
        title: 'cafe',
        value: 'cafe' as 'cafe'
    },
    {
        title: 'bar',
        value: 'bar' as 'bar'
    }
]
const SearchByTypeComponent = <T, >({
                                        defaultSetFilters,
                                        type,
                                        fieldName = 'propertyType',
                                        isShowAllFilters = false,
                                        setType,
                                        setFilters,
                                        styleSx,
                                        setCurrent,
                                        sortTranslatePath = 'home.sortByType',
                                        arrayType = establishmentType
                                    }: IProps<T>) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const bRButtonFilter = '7px';

    const handleSetFilter = (value: string) => {
        setType(value as T)
        if (setCurrent) {
            setCurrent(1)
        }
        if (defaultSetFilters) {
            defaultSetFilters([{
                field: fieldName,
                value: value,
                operator: 'eq'
            }])
        }
    }

    return (
        <ButtonGroup variant={'contained'} sx={{
            p: '5px',
            gap: '10px',
            borderRadius: bRButtonFilter,
            border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`,
            color: 'common.white',
            "& button": {
                height: '30px !important',
                borderRadius: '5px !important',
                p: '0 6px !important',
                textTransform: 'inherit',
                "&:not(:last-of-type)": {
                    position: 'relative',
                    borderRight: 'unset !important',
                }
            },
            ...styleSx
        }}>
            {
                arrayType.map((item, index) => (
                    <Button
                        key={index}
                        sx={{
                            borderRadius: '5px',
                            textTransform: 'capitalize',
                            bgcolor: type === item.value ? 'common.white' : 'transparent',
                            color: type === item.value ? 'common.black' : 'unset',
                            transition: '300ms linear',
                            "&:hover": {
                                bgcolor: 'common.white',
                                color: 'common.black',
                            }
                        }}
                        onClick={() => handleSetFilter(item.value)}
                    >
                        {translate(`${sortTranslatePath}.${item.title}`)}
                    </Button>
                ))
            }
        </ButtonGroup>
    );
};
export default SearchByTypeComponent
