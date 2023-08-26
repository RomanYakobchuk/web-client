import {
    Box,
    Button, ButtonGroup,
    FormControl, FormHelperText, IconButton,
    MenuItem,
    Select,
    Slider,
    TextField
} from "@mui/material";
import {ClearOutlined, FilterList, SearchOutlined} from "@mui/icons-material";
import React, {ChangeEvent, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {CrudFilter, CrudSorting, useTranslate} from "@refinedev/core";
import {useLocation} from "react-router-dom";
import {Input} from "antd";

import {ColorModeContext} from "../../contexts";
import {ModalWindow, SearchCity, VariantComponent} from "../index";
import {antdInputStyle, textFieldStyle} from "../../styles";
import {useMobile} from "../../utils";
import {useDebounce} from "use-debounce";


interface IProps {
    setFilters: any,
    sortBy: string,
    setSortBy: any,
    setSearchValue: any,
    sorters: CrudSorting,
    setSorters: any,
    searchValue: string,
    filters: any,
}

const FilterInstitutions = ({
                                setFilters: defaultSetFilters,
                                sortBy,
                                sorters,
                                setSorters: defaultSetSorters,
                                setSortBy,
                                setSearchValue,
                                searchValue,
                                filters,
                            }: IProps) => {

    const translate = useTranslate();
    const {state: locationState} = useLocation();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [filterLength, setFilterLength] = useState<number>(0);
    const [openAllFilters, setOpenAllFilters] = useState<boolean>(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [newFilters, setFilters] = useState<any>([{}]);
    const [searchCity, setSearchCity] = useState<string>('');
    const [newSorters, setNewSorters] = useState<any>([{}]);
    const [type, setType] = useState<string>("");
    const [valueGte, setValueGte] = useState<number>(0);
    const [valueLte, setValueLte] = useState<number>(2000);
    const [state, setState] = useState<any>(locationState ?? "");
    const [debouncedSearchText] = useDebounce(searchValue, 500);
    const [debouncedSearchCity] = useDebounce(searchCity, 500);

    const isShowAllFilters = width > 600;

    const bRButtonFilter = '7px';

    const handleChange = (newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setValueGte(newValue[0])
            setValueLte(newValue[1])
        }
    };

    const currentSorterOrders = useMemo(() => {
        return {
            rating_asc:
                newSorters?.find((item: any) => item.field === "rating_asc")?.order || "asc",
            rating_desc:
                newSorters?.find((item: any) => item.field === "rating_desc")?.order || "desc",
            createdAt_asc:
                newSorters?.find((item: any) => item.field === "createdAt_asc")?.order || "asc",
            createdAt_desc:
                newSorters?.find((item: any) => item.field === "createdAt_desc")?.order || "desc",
            title_asc:
                newSorters?.find((item: any) => item.field === "title_asc")?.order || "asc",
            title_desc:
                newSorters?.find((item: any) => item.field === "title_desc")?.order || "desc",
            averageCheck_asc:
                newSorters?.find((item: any) => item.field === "averageCheck_asc")?.order || -1,
            averageCheck_desc:
                newSorters?.find((item: any) => item.field === "averageCheck_desc")?.order || 1,
        };
    }, [newSorters]);
    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        const newOrder = field?.split('_')[1];
        defaultSetSorters([
            {
                field,
                order: newOrder,
            },
        ])
    };

    const currentFilterValues = useMemo(() => {
        const logicalFilters = newFilters!?.flatMap((item: CrudFilter) =>
            "field" in item ? item : [],
        );
        return {
            tag:
                logicalFilters?.find((item: any) => item.field === "tag")?.value || '',
            title:
                logicalFilters?.find((item: any) => item.field === "title")?.value || "",
            propertyType:
                logicalFilters?.find((item: any) => item.field === "propertyType")?.value || "",
            averageCheck:
                logicalFilters?.find((item: any) => item.field === "averageCheck")?.value || 0,
            city:
                logicalFilters?.find((item: any) => item.field === "city")?.value || ""
        };
    }, [newFilters]);

    useEffect(() => {
        if (!isShowAllFilters) {
            defaultSetFilters([
                {
                    field: 'title',
                    value: searchValue ?? '',
                    operator: 'contains'
                }
            ])
        }
    }, [debouncedSearchText, isShowAllFilters]);

    useEffect(() => {
        setFilters([
            {
                field: 'averageCheck',
                operator: 'lte',
                value: valueLte ? valueLte : 2000
            },
            {
                field: 'averageCheck',
                operator: 'gte',
                value: valueGte ? valueGte : 20
            },
            {
                field: 'title',
                value: searchValue?.length > 0 ? searchValue : "",
                operator: 'contains'
            },
            {
                field: "propertyType",
                operator: "eq",
                value: type
            },
            {
                field: "city",
                operator: "contains",
                value: searchCity ?? ""
            }
        ])
    }, [valueGte, valueLte, type, searchCity]);

    useEffect(() => {
        if (sorters) {
            setNewSorters([
                {
                    field: sorters[0]?.field,
                    order: sorters[0]?.order
                }
            ])
        }
    }, [sorters]);

    useEffect(() => {
        if (filters?.length > 0) {
            let length = 1;
            for (const filter of filters) {
                if (filter?.field === "averageCheck" && filter?.operator === 'lte') {
                    setValueLte(filter?.value)
                }
                if (filter?.field === "averageCheck" && filter?.operator === 'gte') {
                    setValueGte(filter?.value)
                }
                if (filter?.field === "propertyType" && filter?.value) {
                    setType(filter?.value)
                    length++;
                }
                if (filter?.field === "title" && filter?.value) {
                    setSearchValue(filter?.value)
                }
                if (filter?.field === 'city' && filter?.value) {
                    setSearchCity(filter?.value)
                    length++;
                }
            }
            setFilterLength(length);
        }
    }, [filters]);

    useEffect(() => {
        if (state.value) {
            setSearchValue(state.value)
        }
    }, [state]);

    useEffect(() => {
        if (isShowAllFilters) {
            defaultSetFilters([{
                field: 'city',
                value: searchCity ?? '',
                operator: 'contains'
            }]);
        }
    }, [debouncedSearchCity, isShowAllFilters]);

    const handleSearch = () => {
        defaultSetFilters(newFilters)
        defaultSetSorters(newSorters)
        setOpenFilter(false)
    }

    const handleReplace = () => {
        setSearchValue("");
        setValueGte(0);
        setValueLte(100000);
        setSearchCity("");
        setType('')
        defaultSetFilters([], "replace");
        defaultSetSorters([{field: "", order: "asc"}]);
        setOpenFilter(false);
    }
    const search = () => {
        defaultSetFilters([
            {
                field: 'title',
                value: searchValue ?? '',
                operator: 'contains'
            }
        ])
    }

    const SearchByTypeComponent: ReactNode = (
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
            }
        }}>
            {
                [
                    {
                        title: 'all',
                        value: ''
                    },
                    {
                        title: 'restaurant',
                        value: 'restaurant'
                    },
                    {
                        title: 'cafe',
                        value: 'cafe'
                    },
                    {
                        title: 'bar',
                        value: 'bar'
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

    const SortByTypeComponent: ReactNode = (
        <FormControl
            sx={{width: '100%',}}>
            <Select
                variant={"outlined"}
                size="small"
                color={"info"}
                fullWidth
                displayEmpty
                required
                inputProps={{'aria-label': 'Without label'}}
                value={newSorters[0]?.field ? newSorters[0]?.field : sortBy ? sortBy : ""}
                sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    borderRadius: bRButtonFilter,
                    borderColor: 'common.white',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                }}
                onChange={
                    (e: any) => {
                        setSortBy(e.target.value)
                        toggleSort(e.target.value)
                    }
                }
            >
                <MenuItem value={""}>{translate("home.default")}</MenuItem>
                {
                    [
                        {
                            title: translate("home.sortRating") + '  ' + '↑',
                            value: "rating_asc",
                        },
                        {
                            title: translate("home.sortRating") + '  ' + '↓',
                            value: "rating_desc",
                        },
                        {
                            title: translate('home.oldest'),
                            value: 'createdAt_asc',
                        },
                        {
                            title: translate('home.newest'),
                            value: 'createdAt_desc',
                        },
                        {
                            title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
                            value: 'title_asc'
                        },
                        {
                            title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a"),
                            value: 'title_desc'
                        },
                        {
                            title: translate("home.create.averageCheck") + '  ' + '↑',
                            value: 'averageCheck_asc'
                        },
                        {
                            title: translate("home.create.averageCheck") + '  ' + '↓',
                            value: 'averageCheck_desc'
                        },
                    ].map((type) => (
                        <MenuItem key={type.value}
                                  value={type.value}>{type.title}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )

    const SearchByInputValueComponent: ReactNode = (
        <Box
            sx={{
                ...antdInputStyle,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: width > 500 ? 1 : 0,
                margin: '10px 0',
                "& button": {
                    borderRadius: bRButtonFilter
                },
                "& > span": {
                    borderRadius: bRButtonFilter,
                    border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`
                },
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
                            width < 500 && searchValue?.length > 0 && (
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
                width > 500 &&
                <Button
                    onClick={() => {
                        setSearchValue('');
                        defaultSetFilters([
                            {
                                field: 'title',
                                value: '',
                                operator: 'contains'
                            }
                        ])
                    }}
                    variant={'contained'}
                    sx={{
                        textTransform: 'capitalize',
                        bgcolor: 'common.black',
                        color: 'common.white',
                        border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`,
                        boxShadow: '0px 0px 1px 1px #000',
                        "&:hover": {
                            bgcolor: 'common.black',
                            color: 'common.white',
                        }
                    }}>
                    {translate('buttons.clear')}
                </Button>
            }
            {
                width > 500 &&
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
    )
    const SearchByAverageCheckComponent: ReactNode = (
        <FormControl
            sx={{width: '100%',}}>
            <FormHelperText
                sx={{
                    fontSize: '14px',
                    mb: 0.5,
                    color: 'text.primary'
                }}
            >
                {translate('home.create.averageCheck')}
            </FormHelperText>
            <Box sx={{
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                }}>
                    <TextField
                        color={"secondary"}
                        sx={{
                            width: '40%',
                            borderColor: 'silver',
                            minWidth: '30%',
                            ...textFieldStyle
                        }}
                        id="outlined-number-1"
                        size={"small"}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }}
                        value={valueGte}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setValueGte(Number(e.target.value))
                            setFilters([{
                                field: 'averageCheck',
                                operator: 'gte',
                                value: e.target.value ? e.target.value : undefined
                            }])
                        }}
                    />
                    <TextField
                        color={"secondary"}
                        sx={{
                            width: '40%',
                            borderColor: 'silver',
                            minWidth: '30%',
                            ...textFieldStyle
                        }}
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }}
                        id="outlined-number-2"
                        size={"small"}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={valueLte}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setValueLte(Number(e.target.value))
                            setFilters([{
                                field: 'averageCheck',
                                operator: 'lte',
                                value: e.target.value ? e.target.value : undefined
                            }])
                        }}
                    />
                </Box>
                <Box sx={{
                    width: '90%',
                    margin: 'auto'
                }}>
                    <Slider
                        color={"secondary"}
                        value={[Number(valueGte), Number(valueLte)]}
                        min={0}
                        max={100000}
                        onChange={(event: any, value: any) => {
                            handleChange(value);
                        }}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Box>
        </FormControl>
    )
    const SearchByCityComponent: ReactNode = (
        <FormControl
            sx={{
                height: '100%',
                width: '100%',
                "& input::placeholder": {
                    color: 'common.white'
                }
            }}>
            <SearchCity searchCity={searchCity} setSearchCity={setSearchCity}/>
        </FormControl>
    )

    const SearchButtonsComponents: ReactNode = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            justifyContent: {xs: 'space-between', sm: 'start', md: 'end'},
            gap: 2
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
                        isShowAllFilters ? setOpenAllFilters(false) : setOpenFilter(false)
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
    )

    const filterButton: ReactNode = (
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
                borderRadius: bRButtonFilter
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
    )

    return (
        <Box sx={{
            width: '100%',
            gap: isShowAllFilters ? 2 : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            "& input": {
                border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`
            },
        }}>
            {
                isShowAllFilters && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        height: '40px'
                    }}>
                        <Box sx={{
                            height: '100%',
                            minWidth: '30%',
                            maxWidth: '350px',
                            width: '100%'
                        }}>
                            {
                                SearchByCityComponent
                            }
                        </Box>
                        {filterButton}
                    </Box>
                )
            }
            {
                SearchByInputValueComponent
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                {
                    isShowAllFilters ? (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2,
                            }}>
                                {SearchByTypeComponent}
                                {SortByTypeComponent}
                            </Box>
                            <VariantComponent type={'establishment'}/>
                        </Box>
                    ) : (
                        <Box sx={{
                            width: '100%',
                            "& > button": {
                                width: '100%'
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            {filterButton}
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                "& > div": {
                                    width: 'fit-content'
                                }
                            }}>
                                {SortByTypeComponent}
                                <VariantComponent type={'establishment'}/>
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
            }}>
                <ModalWindow open={openFilter} setOpen={setOpenFilter} title={
                    <Box sx={{
                        fontSize: {xs: '20px', md: '24px'},
                        fontWeight: 600,
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {translate('buttons.filter')}
                    </Box>
                }>
                    {
                        openFilter && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                pt: 2
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}>
                                    {
                                        !isShowAllFilters && (
                                            <>
                                                {SearchByCityComponent}
                                                {SearchByTypeComponent}
                                            </>
                                        )
                                    }
                                    {SearchByAverageCheckComponent}
                                </Box>
                                {SearchButtonsComponents}
                            </Box>
                        )
                    }
                </ModalWindow>
            </Box>
        </Box>
    );
};
export default FilterInstitutions;
