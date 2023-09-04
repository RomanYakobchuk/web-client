import {Button, ButtonGroup, SxProps} from "@mui/material";
import React, {useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../../../contexts";
import {EstablishmentType, SetFilterType} from "../../../../interfaces/types";

interface IProps {
    defaultSetFilters: SetFilterType,
    setFilters: SetFilterType,
    type: EstablishmentType,
    isShowAllFilters: boolean,
    setType: (value: EstablishmentType) => void,
    styleSx?: SxProps
}
const SearchByTypeComponent = ({defaultSetFilters, type, isShowAllFilters, setType, setFilters, styleSx}: IProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const bRButtonFilter = '7px';

    return (
        <ButtonGroup variant={'contained'} sx={{
            p: '5px',
            gap: '10px',
            bgcolor: 'common.black',
            borderRadius: bRButtonFilter,
            border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`,
            "& button": {
                height: '30px !important',
                borderRadius: '5px !important',
                p: '0 10px !important',
                "&:not(:last-of-type)": {
                    position: 'relative',
                    borderRight: 'unset !important',
                }
            },
            ...styleSx
        }}>
            {
                [
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
                ].map((item, index) => (
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
                        onClick={() => {
                            if (isShowAllFilters) {
                                defaultSetFilters([{
                                    field: 'propertyType',
                                    value: item.value,
                                    operator: 'eq'
                                }])
                                setType(item.value)
                            } else {
                                setFilters([{
                                    field: 'propertyType',
                                    value: item.value,
                                    operator: 'eq'
                                }])
                                setType(item.value)
                            }
                        }
                        }>
                        {translate(`home.sortByType.${item.title}`)}
                    </Button>
                ))
            }
        </ButtonGroup>
    );
};
export default SearchByTypeComponent
