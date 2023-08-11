import {
    Box,
    Button,
    FormControl, FormHelperText, IconButton,
    MenuItem,
    Select,
    Slider,
    TextField
} from "@mui/material";
import {ClearOutlined, FilterList, SearchOutlined} from "@mui/icons-material";
import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import {CrudFilter, CrudSorting, useTranslate} from "@refinedev/core";
import {useLocation} from "react-router-dom";
import {Input} from "antd";

import {ColorModeContext} from "../../contexts";
import {ModalWindow, SearchCity} from "../index";
import {antdInputStyle, buttonStyle, selectStyle, textFieldStyle} from "../../styles";
import {useMobile} from "../../utils";


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
    const {state: locationState, search} = useLocation();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [openFilter, setOpenFilter] = useState(false);
    const [newFilters, setFilters] = useState<any>([{}]);
    const [searchCity, setSearchCity] = useState<string>('');
    const [newSorters, setNewSorters] = useState<any>([{}]);
    const [type, setType] = useState<string>("");
    const [valueGte, setValueGte] = useState<number>(0);
    const [valueLte, setValueLte] = useState<number>(2000);
    const [state, setState] = useState<any>(locationState ?? "");

    const handleChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
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
        setNewSorters([
            {
                field,
                order: newOrder,
            },
        ]);
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
    }, [sorters])

    useEffect(() => {
        if (filters?.length > 0) {
            for (const filter of filters) {
                if (filter?.field === "averageCheck" && filter?.operator === 'lte') {
                    setValueLte(filter?.value)
                } else if (filter?.field === "averageCheck" && filter?.operator === 'gte') {
                    setValueGte(filter?.value)
                } else if (filter?.field === "propertyType") {
                    setType(filter?.value)
                } else if (filter?.field === "title_like" && filter?.value) {
                    setSearchValue(filter?.value)
                } else if (filter?.field === 'city' && filter?.value) {
                    setSearchCity(filter?.value)
                }
            }
        }
    }, [filters])

    useEffect(() => {
        if (state.value) {
            setSearchValue(state.value)
        }
    }, [state])

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
        defaultSetFilters([], "replace");
        defaultSetSorters([{field: "", order: "asc"}]);
        setOpenFilter(false);
    }

    const isShowAllFilters = width > 1000;

    const filtersComponents = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            justifyContent: {xs: 'space-between', sm: 'start', md: 'end'},
            gap: 2
        }}>
            <FormControl sx={{width: '100%',}}>
                <FormHelperText
                    sx={{
                        fontSize: '14px',
                        mb: 0.5,
                        color: (theme) => theme.palette.text.primary
                    }}
                >
                    {translate('home.create.type.title')}
                </FormHelperText>
                <Select
                    variant={"outlined"}
                    size="small"
                    color={"info"}
                    displayEmpty
                    fullWidth
                    required
                    inputProps={{'aria-label': 'Without label'}}
                    sx={{
                        fontSize: {xs: '12px', sm: '16px'},
                        ...selectStyle
                    }}
                    value={type ?? currentFilterValues.propertyType}
                    onChange={(e) => {
                        setType(e.target.value)
                        setFilters([{
                            field: 'propertyType',
                            operator: 'eq',
                            value: e.target.value ? e.target.value : undefined
                        }])
                    }}>
                    <MenuItem value={""}>{translate("home.sortByType.all")}</MenuItem>
                    {
                        [{
                            title: translate("home.sortByType.bar"),
                            value: "bar"
                        }, {
                            title: translate("home.sortByType.cafe"),
                            value: "cafe"
                        }, {
                            title: translate("home.sortByType.restaurant"),
                            value: "restaurant"
                        }].map((type) => (
                            <MenuItem key={type.value}
                                      value={type.value.toLowerCase()}>{type.title}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl
                sx={{width: '100%',}}>
                <FormHelperText
                    sx={{
                        fontSize: '14px',
                        mb: 0.5,
                        color: (theme) => theme.palette.text.primary
                    }}
                >
                    {translate('home.create.location.title')}
                </FormHelperText>
                <SearchCity searchCity={searchCity} setSearchCity={setSearchCity}/>
            </FormControl>
            <FormControl
                sx={{width: '100%',}}>
                <FormHelperText
                    sx={{
                        fontSize: '14px',
                        mb: 0.5,
                        color: (theme) => theme.palette.text.primary
                    }}
                >
                    {translate('home.sort')}
                </FormHelperText>
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
                        ...selectStyle
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
                                title: 'Найстаріші',
                                value: 'createdAt_asc',
                            },
                            {
                                title: 'Найновіші',
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
            <FormControl
                sx={{width: '100%',}}>
                <FormHelperText
                    sx={{
                        fontSize: '14px',
                        mb: 0.5,
                        color: (theme) => theme.palette.text.primary
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
                                width: '100px',
                                borderColor: 'silver',
                                minWidth: '140px',
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
                                width: '100px',
                                borderColor: 'silver',
                                minWidth: '140px',
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
                                handleChange(event, value);
                            }}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </Box>
            </FormControl>
            <Button
                onClick={handleReplace}
                color={"inherit"}
                variant={"outlined"}
                sx={{
                    ...buttonStyle
                }}
            >
                {
                    translate("home.reset")
                }
            </Button>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {
                    !isShowAllFilters && (
                        <Button
                            sx={{
                                width: '100%%',
                                ...buttonStyle
                            }}
                            color={"error"}
                            variant={"contained"}
                            onClick={() => setOpenFilter(false)}
                        >
                            {translate("buttons.cancel")}
                        </Button>
                    )
                }
                <Button
                    variant={"contained"}
                    color={"info"}
                    sx={{
                        width: '100%',
                        ...buttonStyle
                    }}
                    onClick={handleSearch}>
                    {translate("buttons.search")}
                </Button>
            </Box>
        </Box>
    )

    return (
        <Box sx={{
            width: '100%',
            gap: isShowAllFilters ? 0 : 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                ...antdInputStyle,
                width: '100%',
            }}>
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
                                searchValue?.length > 0 && (
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
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
            }}>
                {
                    !isShowAllFilters && (
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={() => setOpenFilter(true)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                width: '100%',
                                alignItems: 'center'
                            }}
                        >
                            <FilterList/>
                            {translate('buttons.filter')}
                        </Button>
                    )
                }

                <ModalWindow open={openFilter} setOpen={setOpenFilter} title={
                    <Box>
                        {translate('buttons.filter')}
                    </Box>
                }>
                    {openFilter && (
                        <Box>
                            {filtersComponents}
                        </Box>
                    )}
                </ModalWindow>

            </Box>
            {
                isShowAllFilters && (
                    <Box>
                        {filtersComponents}
                    </Box>
                )
            }
        </Box>
    );
};
export default FilterInstitutions;
