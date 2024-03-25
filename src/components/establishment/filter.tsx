import React, {Dispatch, ReactNode, useContext, useEffect, useLayoutEffect, useState} from "react";
import {CrudFilters, CrudSorting, useTranslate} from "@refinedev/core";
import {Box, FormControl} from "@mui/material";
import {useDebounce} from "use-debounce";

import {
    CustomOpenContentBtn,
    FilterBtn,
    ModalWindow,
    SearchCity,
} from "../index";
import {useMobile} from "@/hook";
import {EstablishmentType, SetFilterType} from "@/interfaces/types";
import {
    SearchButtonFilterComponent,
    SearchByFreeSeats,
    SearchByTypeComponent,
    SearchInputComponent
} from "../common/search";
import SortEstablishmentComponent from "../common/search/establishment/sortEstablishmentComponent";
import {IFreeSeatsProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {SelectAverageCheck} from "@/components/common/search/establishment/selectAverageCheck";

interface IProps {
    setFilters: SetFilterType,
    setSearchValue: (value: string) => void,
    sorters: CrudSorting,
    setSorters: (sorter: CrudSorting) => void,
    searchValue: string,
    filters: CrudFilters,
    setCurrent: Dispatch<React.SetStateAction<number>>,
    currentFilterValues: {
        title: string,
        city_like: string,
        propertyType: EstablishmentType,
        averageCheck_lte: number,
        averageCheck_gte: number,
    }
}

const FilterEstablishments = ({
                                  setFilters: defaultSetFilters,
                                  sorters,
                                  setSorters: defaultSetSorters,
                                  setSearchValue,
                                  searchValue,
                                  filters,
                                  setCurrent,
                                  currentFilterValues
                              }: IProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [newFilters, setFilters] = useState<CrudFilters>(filters);
    const [freeSeats, setFreeSeats] = useState({} as IFreeSeatsProps);
    const [filterLength, setFilterLength] = useState<number>(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [searchCity, setSearchCity] = useState<string>(currentFilterValues?.city_like);
    const [type, setType] = useState<EstablishmentType>(currentFilterValues?.propertyType);
    const [valueGte, setValueGte] = useState<number>(currentFilterValues?.averageCheck_gte);
    const [valueLte, setValueLte] = useState<number>(currentFilterValues?.averageCheck_lte);
    const [debouncedSearchCity] = useDebounce(searchCity, 500);

    const isShowAllFilters = width > 600;

    useLayoutEffect(() => {
        if (currentFilterValues) {
            setValueLte(currentFilterValues?.averageCheck_lte)
            setValueGte(currentFilterValues?.averageCheck_gte)
            setType(currentFilterValues?.propertyType)
            setSearchCity(currentFilterValues?.city_like)
            setFilterLength(filters?.length);
        }
    }, [currentFilterValues, filters]);
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
        // defaultSetSorters(newSorters)
        setOpenFilter(false)
    }

    const handleSearchByTitle = (value: string) => {
        defaultSetFilters([
            {
                field: 'title',
                value: value,
                operator: 'eq'
            }
        ])
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
                        <FilterBtn
                            setOpenFilter={setOpenFilter}
                            filterLength={filterLength}
                            isShowAllFilters={isShowAllFilters}
                        />
                    </Box>
                )
            }
            <SearchInputComponent
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                defaultSetFilters={defaultSetFilters}
                handleSearchByValue={handleSearchByTitle}
                isButton={width > 500}
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <Box sx={{
                    width: '100%',
                    "& > button": {
                        width: '100%'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    {
                        !isShowAllFilters && (
                            <FilterBtn
                                setOpenFilter={setOpenFilter}
                                filterLength={filterLength}
                                isShowAllFilters={isShowAllFilters}
                            />
                        )
                    }
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        // flexDirection: "column",
                        // alignItems: 'start',
                        // "@media screen and (min-width: 500px)": {
                        alignItems: 'center',
                        flexDirection: "row",
                        flexWrap: 'wrap',
                        // },
                        justifyContent: 'space-between',
                        // flexWrap: 'wrap',
                        gap: {xs: 1, xl: 2}
                    }}>
                        <SearchByTypeComponent
                            styleSx={{
                                "@media screen and (width < 490px)": {
                                    order: 3,
                                }
                            }}
                            defaultSetFilters={defaultSetFilters}
                            type={type}
                            setCurrent={setCurrent}
                            setType={setType}
                        />
                        <Box
                            sx={{
                                width: '195px',
                                "@media screen and (width < 490px)": {
                                    width: '195px'
                                },
                                "@media screen and (width < 420px)": {
                                    width: '145px'
                                },
                                "@media screen and (490px <= width <= 630px)": {
                                    order: 3,
                                    width: '195px'
                                }
                            }}
                        >
                            <SortEstablishmentComponent
                                btnHeight={'42px'}
                                position={width < 500 ? "left" : 'right'}
                                btnWidth={'100%'}
                                sorters={sorters}
                                defaultSetSorters={defaultSetSorters}
                            />
                        </Box>
                        <SelectAverageCheck
                            valueGte={valueGte}
                            setValueGte={setValueGte}
                            valueLte={valueLte}
                            setValueLte={setValueLte}
                            setFilters={setFilters}
                            handleSearch={handleSearch}
                        />
                    </Box>
                </Box>
            </Box>
            <ModalWindow
                timeOut={500}
                open={openFilter}
                setOpen={setOpenFilter}
                title={
                    <Box sx={{
                        fontSize: {xs: '20px', md: '24px'},
                        fontWeight: 600,
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {translate('buttons.filter')}
                    </Box>
                }
                bodyProps={{
                    maxWidth: '100%'
                }}
            >
                {
                    openFilter && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            pt: 2,
                            px: 3
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                alignItems: 'start'
                            }}>
                                {
                                    !isShowAllFilters && (
                                        <Box sx={{
                                            width: '100%'
                                        }}>
                                            {
                                                SearchByCityComponent
                                            }
                                        </Box>
                                    )
                                }
                                <SearchByFreeSeats freeSeats={freeSeats} setFreeSeats={setFreeSeats}/>
                                <CustomOpenContentBtn
                                    style={{
                                        bgcolor: mode === 'dark' ? '#000' : '#fff',
                                        p: '10px'
                                    }}
                                    openText={translate('')}
                                >
                                </CustomOpenContentBtn>
                            </Box>
                            <Box sx={{
                                // position: isFilterBtnAbsolute ? 'absolute' : 'unset',
                                // bottom: '15px',
                                // left: 0,
                                // right: 0,
                                width: '90%',
                                margin: '0 auto'
                            }}>
                                <SearchButtonFilterComponent
                                    setOpenFilter={setOpenFilter}
                                    handleReplace={handleReplace}
                                    handleSearch={handleSearch}
                                />
                            </Box>
                        </Box>
                    )
                }
            </ModalWindow>
        </Box>
    );
};
export default FilterEstablishments;
