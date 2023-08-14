import {useNavigate} from "react-router-dom";
import {CanAccess, useGetIdentity, useTable, useTranslate} from "@refinedev/core";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {useState} from "react";

import {FilterInstitutions, Loading, PaginationComponent, InstitutionCard} from "../index";
import {IGetIdentity, ProfileProps, PropertyProps} from "../../interfaces/common";
import {buttonStyle} from "../../styles";
import {useMobile} from "../../utils";

const UserList = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const [sortBy, setSortBy] = useState("");
    const {width} = useMobile();

    const [favPlace, setFavPlaces] = useState<any>(user?.favoritePlaces);
    const [searchValue, setSearchValue] = useState<any>();

    const {
        tableQueryResult: {data, isLoading, isError},
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        pageSize,
        setSorters,
        filters,
        setFilters,
    } = useTable({
        resource: "institution/all",
    });

    const allInstitutions = data?.data ?? [];

    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '1200px',
            margin: '0 auto'
        }}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Box mb={1} mt={1} width={"100%"}>
                        <FilterInstitutions
                            filters={filters}
                            setFilters={setFilters}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            setSearchValue={setSearchValue}
                            sorters={sorters}
                            setSorters={setSorters}
                            searchValue={searchValue}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    maxHeight: '88vh',
                    minHeight: 'fit-content',
                }}>
                    <Stack direction={"column"} width={"100%"}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <CanAccess resource={"all_institutions"} action={"create"}>
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Button
                                        color={"info"} variant={"contained"}
                                        startIcon={<Add/>}
                                        sx={buttonStyle}
                                        onClick={() => navigate('/all_institutions/create')}>
                                        {translate("home.create.title")}
                                    </Button>
                                </Stack>
                            </CanAccess>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                justifyContent: width > 1000 ? 'unset' : 'center',
                alignItems: width > 1000 ? 'unset' : 'start'
            }}>
                <Grid container spacing={2} sx={{
                    justifyContent: {xs: 'center', sm: 'normal'}
                }}>
                    {
                        isLoading ? <Loading height={'60vh'}/> :
                            allInstitutions?.length > 0 ?
                                allInstitutions.map((institution: PropertyProps | any) => (
                                    <Grid
                                        sx={{
                                            display: 'grid',
                                            maxWidth: {xs: '350px'}
                                        }}
                                        item
                                        key={institution?._id}
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        xl={3}
                                    >
                                        <InstitutionCard
                                            otherProps={setFavPlaces}
                                            key={institution._id}
                                            institution={institution}
                                        />
                                    </Grid>
                                ))
                                : <Box sx={{
                                    width: '100%',
                                    height: '250px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {translate('text.notResult')}
                                </Box>
                    }
                </Grid>
                {
                    allInstitutions.length > 0 && (
                        <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent}
                                             pageCount={pageSize} setPageSize={setPageSize}/>
                    )
                }
            </Box>
        </Box>
    );
};
export default UserList;
