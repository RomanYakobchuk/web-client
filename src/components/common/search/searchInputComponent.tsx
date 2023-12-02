import {Input} from "antd";
import {Box, Button, IconButton, SxProps} from "@mui/material";
import {ClearOutlined, SearchOutlined} from "@mui/icons-material";
import React, {useContext, useEffect} from "react";
import {useTranslate} from "@refinedev/core";

import {antdInputStyle} from "@/styles";
import {useMobile} from "@/hook";
import {ColorModeContext} from "@/contexts";
import {SetFilterType} from "@/interfaces/types";
import {useDebounce} from "use-debounce";

type TProps = {
    searchValue: string,
    setSearchValue: (value: string) => void,
    defaultSetFilters?: SetFilterType,
    isButton?: boolean,
    fieldName?: string,
    styleSx?: SxProps
}
const SearchInputComponent = ({setSearchValue, searchValue, defaultSetFilters, styleSx, isButton = true, fieldName = 'title'}: TProps) => {
    const translate = useTranslate();
    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext);

    const [useDebounce1] = useDebounce(searchValue, 500);
    const search = () => {
        if (defaultSetFilters) {
            defaultSetFilters([
                {
                    field: fieldName,
                    value: searchValue ?? '',
                    operator: 'contains'
                }
            ])
        }
    }

    const bRButtonFilter = '7px';

    useEffect(() => {
        if (!isButton) {
            search()
        }
    }, [isButton, useDebounce1]);
    return (
        <Box
            sx={{
                ...antdInputStyle,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: width > 500 ? 1 : 0,
                margin: '10px 0',
                "& button": {
                    borderRadius: bRButtonFilter,
                    display: (width > 500 && isButton) ? 'flex' : 'none'
                },
                "& > span": {
                    borderRadius: bRButtonFilter,
                    border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`
                },
                ...styleSx
            }}
        >
            <Input
                style={{
                    width: '100%',
                    fontSize: '20px',
                    gap: 2,
                    color: mode === 'dark' ? 'white' : 'black',
                    background: 'transparent',
                }}
                value={searchValue ?? ''}
                onChange={(event) => setSearchValue(event.target.value)}
                suffix={
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: searchValue?.length > 0 ? 1 : 0
                    }}>
                        <SearchOutlined/>
                        {
                            (width < 500 || !isButton) && searchValue?.length > 0 && (
                                <IconButton size={"small"} onClick={() => setSearchValue('')}>
                                    <ClearOutlined/>
                                </IconButton>
                            )
                        }
                    </Box>
                }
                size={'middle'}
                placeholder={`${translate('buttons.search')}...`}
            />
            {
                (width > 500 && isButton) &&
                <Button
                    onClick={() => {
                        setSearchValue('');
                        if (defaultSetFilters) {
                            defaultSetFilters([
                                {
                                    field: 'title',
                                    value: '',
                                    operator: 'contains'
                                }
                            ])
                        }
                    }}
                    variant={'contained'}
                    sx={{
                        textTransform: 'capitalize',
                        bgcolor: 'common.black',
                        color: 'common.white',
                        border: `1px solid ${mode === 'dark' ? '#fff' : 'transparent'}`,
                        // boxShadow: '0px 0px 1px 1px #000',
                        "&:hover": {
                            bgcolor: 'common.black',
                            color: 'common.white',
                        }
                    }}>
                    {translate('buttons.clear')}
                </Button>
            }
            {
                (width > 500 && isButton) &&
                <Button
                    onClick={search}
                    variant={'contained'}
                    sx={{
                        textTransform: 'capitalize',
                        bgcolor: 'common.white',
                        color: 'common.black',
                        ":hover": {
                            bgcolor: 'common.white',
                            color: 'common.black',
                        }
                    }}>
                    {translate('buttons.search')}
                </Button>
            }
        </Box>
    );
};
export default SearchInputComponent;
