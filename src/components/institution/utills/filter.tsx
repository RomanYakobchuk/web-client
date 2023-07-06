import {
    Box,
    Button,
    FormControl, FormHelperText,
    MenuItem,
    Select,
    Slider,
    TextField
} from "@mui/material";
import {CancelOutlined, TuneOutlined} from "@mui/icons-material";
import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from "react";
import {CrudFilter, CrudSorting, useTranslate} from "@refinedev/core";
import {useLocation} from "react-router-dom";

import {ColorModeContext} from "../../../contexts";
import {SearchCity} from "../../index";
import {buttonStyle, selectStyle, textFieldStyle} from "../../../styles";
import {useMobile} from "../../../utils";


interface IProps {
    setFilters: any,
    sortBy: string,
    setSortBy: any,
    setSearchValue: any,
    sorters: CrudSorting,
    setSorters: any,
    byTags: boolean,
    searchValue: string,
    filters: any,
    setByTags: any
}

const FilterInstitutions = ({
                                setFilters: defaultSetFilters,
                                sortBy,
                                sorters,
                                setSorters: defaultSetSorters,
                                setSortBy,
                                setSearchValue,
                                byTags,
                                searchValue,
                                filters,
                                setByTags
                            }: IProps) => {

    const translate = useTranslate();
    const {state: locationState, search} = useLocation();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [openFilter, setOpenFilter] = useState(false);
    const [newFilters, setFilters] = useState<any>();
    const [searchCity, setSearchCity] = useState<string>('');
    const [newSorters, setNewSorters] = useState<any>();
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
                field: 'tag',
                value: byTags && searchValue?.length > 0 ? searchValue : "",
                operator: 'contains'
            },
            {
                field: 'title',
                value: !byTags && searchValue?.length > 0 ? searchValue : "",
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
    }, [valueGte, valueLte, type, byTags, searchCity]);

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
                } else if (filter?.field === "tag" && filter?.value) {
                    setByTags(true)
                    setSearchValue(filter?.value)
                } else if (filter?.field === "title" && filter?.value) {
                    setByTags(false)
                    setSearchValue(filter?.value)
                } else if (filter?.field === 'city' && filter?.value) {
                    setSearchCity(filter?.value)
                }
            }
        }
    }, [filters])

    useEffect(() => {
        if (state.value && state.isTag) {
            setByTags(true)
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
        setByTags(false);
        setOpenFilter(false);
    }


    return (
        <Box sx={{
            width: '100%',
            gap: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                width: '100%',
                position: 'relative',
            }}>
                <TextField fullWidth variant={"outlined"} color={"secondary"}
                           sx={{
                               fontSize: {xs: '10px', sm: '16px'},
                               "> div": {
                                   borderRadius: '50px',
                               },
                               "& div input": {
                                   pr: '30px'
                               }
                           }}
                           size="small"
                           placeholder={translate("home.search")}
                           value={searchValue ? searchValue : ""}
                           onChange={(e) => {
                               setSearchValue(e.target.value)
                               setFilters([{
                                   field: byTags ? "tag" : 'title',
                                   operator: 'contains',
                                   value: e.currentTarget.value ? e.currentTarget.value : undefined
                               }])
                           }}/>
                <CancelOutlined onClick={() => {
                    setSearchValue("")
                }} sx={{
                    position: 'absolute',
                    right: '5px',
                    top: "8px",
                    cursor: 'pointer'
                }}/>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => setOpenFilter(true)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center'
                    }}
                >
                    <TuneOutlined
                        sx={{
                            cursor: 'pointer'
                        }}
                    />
                    {width > 600 && translate('buttons.filter')}
                </Button>
                {
                    openFilter &&
                    (<Box
                        sx={{
                            position: 'fixed',
                            minHeight: '100vh',
                            top: 0,
                            right: 0,
                            left: {xs: 0, md: 'auto'},
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            bgcolor: 'rgba(47,37,37,0.5)'
                        }}>
                        <Box
                            sx={{
                                width: {xs: '320px', sm: '450px'},
                                bgcolor: (theme) => theme.palette.primary.main,
                                p: '20px',
                                borderRadius: '10px'
                            }}>
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
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button
                                        sx={{
                                            width: '35%',
                                            ...buttonStyle
                                        }}
                                        color={"error"}
                                        variant={"contained"}
                                        onClick={() => setOpenFilter(false)}
                                    >
                                        {translate("buttons.cancel")}
                                    </Button>
                                    <Button
                                        variant={"contained"}
                                        color={"info"}
                                        sx={{
                                            width: '60%',
                                            ...buttonStyle
                                        }}
                                        onClick={handleSearch}>
                                        {translate("buttons.search")}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>)
                }
            </Box>
        </Box>
    );
};
export default FilterInstitutions;
