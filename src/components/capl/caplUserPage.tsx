import React, {useEffect, useMemo, useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import {CanAccess, CrudFilter, LogicalFilter, useTable, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {Edit} from "@mui/icons-material";

import {Loading, PaginationComponent, ReservedCard} from "../index";
import {IReserve} from "@/interfaces/common";
import {useMobile} from "@/hook";
import {SearchByTypeComponent, SearchInputComponent, SortCapl, SortNewsComponent} from "@/components/common/search";
import {useDebounce} from "use-debounce";

const types = [
    {
        title: 'all',
        value: '' as ""
    },
    {
        title: 'active',
        value: 'true'
    },
    {
        title: 'inactive',
        value: 'false'
    },
]
const CaplUserPage = () => {

    const translate = useTranslate();
    const navigate = useNavigate();
    const {width} = useMobile();

    const [sortBy, setSortBy] = useState("");
    const [type, setType] = useState<string>("")
    const [searchValue, setSearchValue] = useState<string>("");
    const [debounceSearchValue] = useDebounce(searchValue, 500);
    const {
        tableQueryResult: {data, isLoading, isError},
        sorters,
        setSorters,
        filters,
        setFilters,
        pageSize,
        setPageSize,
        current,
        setCurrent
    } = useTable({
        resource: `capl/allByUser`,
        syncWithLocation: true
    })
    const reservations: IReserve[] | any = data?.data ?? [];

    // const gridColumnsLength = width < 750 ? 1 : width < 1450 ? 2 : width < 1800 ? 3 : 4;

    // useEffect(() => {
    //     setFilters([
    //         {
    //             value: searchValue,
    //             field: 'search',
    //             operator: 'contains'
    //         }
    //     ])
    // }, [searchValue]);


    // useEffect(() => {
    //     setFilters([
    //         {
    //             value: type,
    //             field: 'active',
    //             operator: "eq"
    //         }
    //     ])
    // }, [type]);

    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters!?.flatMap((item: CrudFilter) =>
            "field" in item ? item : [],
        );
        return {
            fullName:
                logicalFilters?.find((item: any) => item.field === "fullName")?.value || "",
            active:
                logicalFilters?.find((item: any) => item.field === "active")?.value || "",
            search:
                logicalFilters?.find((item: any) => item.field === "search_like")?.value || "",
            // city:
            //     logicalFilters?.find((item: any) => item.field === "city")?.value || ""
        };
    }, [filters]);
    return (
        <Box sx={{
            width: '100%'
        }}>
            <CanAccess resource={'capl'} action={'userListReserve'}>
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}>
                    <Button
                        variant={'contained'}
                        startIcon={<Edit/>}
                        color={"primary"}
                        sx={{
                            textTransform: 'inherit',
                            fontSize: {xs: '14px', md: '16px'},
                            borderRadius: '7px'
                        }}
                        onClick={() => navigate(`/capl/create`)}
                    >
                        {translate('capl.title')}
                    </Button>

                </Box>
            </CanAccess>
            <Typography my={1}
                        variant={'h5'}
                        sx={{
                            color: 'common.white'
                        }}
            >
                {translate('capl.main.yourReserve', {length: data?.total})}
            </Typography>
            <Box sx={{
                width: '100%',
                my: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                <Box sx={{
                    width: '100%',
                    // maxWidth: '800px',
                    flexWrap: 'wrap',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: {xs: 'start', sm: 'center'},
                    justifyContent: 'start'
                }}>
                    <Box sx={{
                        maxWidth: {xs: '100%', sm: '380px', md: '550px'},
                        width: '100%'
                    }}>
                        <SearchInputComponent
                            styleSx={{
                                my: 0
                            }}
                            defaultSetFilters={setFilters}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            isButton={false}
                            fieldName={'search'}
                        />
                    </Box>
                    <Box sx={{
                        width: '100%',
                        maxWidth: '200px'
                    }}>
                        <SortCapl
                            setSortBy={setSortBy}
                            sortBy={sortBy}
                            sorters={sorters}
                            setSorters={setSorters}
                        />
                    </Box>
                    <Box>
                        <SearchByTypeComponent
                            type={currentFilterValues['active'] ?? ''}
                            setType={setType}
                            fieldName={'active'}
                            setCurrent={setCurrent}
                            setFilters={setFilters}
                            arrayType={types}
                            sortTranslatePath={'capl.status.valid'}
                        />
                    </Box>
                </Box>
            </Box>
            {
                isLoading
                    ? <Loading height={'200px'}/>
                    : isError
                        ? <p>Error</p>
                        : reservations?.length > 0 &&
                        <Box sx={{
                            width: '100%',
                            display: 'grid',
                            gap: 1.5,
                            // gridTemplateColumns: `repeat(${gridColumnsLength}, 1fr)`
                            gridTemplateColumns: `repeat(auto-fill, minmax(290px, 1fr))`
                        }}>
                            {
                                reservations?.map((item: IReserve, index: number) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <ReservedCard
                                                key={index}
                                                reserve={item}
                                            />
                                        </Box>
                                    )
                                )
                            }
                        </Box>
            }
            <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent}
                                 pageCount={pageSize} setPageSize={setPageSize}/>
        </Box>
    )
        ;
};
export default CaplUserPage;
