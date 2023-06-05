import {useNavigate} from "react-router-dom";
import {CanAccess, useGetIdentity, useLink, useOnError, useTable, useTranslate} from "@refinedev/core";
import {useDebounce} from "use-debounce";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {useContext, useEffect, useState} from "react";

import {CustomButton, FilterInstitutions, Loading, Pagination, PropertyCard} from "../index";
import {ProfileProps, PropertyProps} from "../../interfaces/common";
import {useMobile} from "../../utils";
import {ColorModeContext} from "../../contexts";

const UserList = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const {data: user} = useGetIdentity<ProfileProps>();
    const [sortBy, setSortBy] = useState("");
    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const {mutate: onError} = useOnError();

    const [byTags, setByTags] = useState(false);
    const [favPlace, setFavPlaces] = useState<any>(user?.favoritePlaces);
    const [searchValue, setSearchValue] = useState<any>();
    const [debouncedSearchText] = useDebounce(searchValue, 500);

    const {
        tableQueryResult: {data, isLoading, isError},
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        setSorters,
        filters,
        setFilters,
    } = useTable({
        resource: "institution/all",
    });

    const allInstitutions = data?.data ?? [];

    const Link = useLink();
    useEffect(() => {
        if (byTags) {
            setFilters([
                {
                    field: 'tag',
                    value: debouncedSearchText,
                    operator: 'contains'
                },
                {
                    field: 'title',
                    value: "",
                    operator: 'contains'
                }
            ])
        } else {
            setFilters([
                {
                    field: 'tag',
                    value: "",
                    operator: 'contains'
                },
                {
                    field: 'title',
                    value: debouncedSearchText,
                    operator: 'contains'
                }
            ])
        }
    }, [byTags, debouncedSearchText])

    const searchByValue = async () => {
        setByTags(!byTags)
    }

    if (isError) return <Typography>Error...</Typography>;

    return (
        <>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
            }}>
                <Stack direction={"column"} width={"100%"}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '16px', sm: '24px'}
                        }} fontWeight={700} color={mode === "dark" ? "#fcfcfc" : "#11142D"}>
                            {
                                !allInstitutions.length ? translate("home.notHave") : translate("home.title")
                            }
                        </Typography>
                        <CanAccess resource={"all_institutions"} action={"create"}>
                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <CustomButton title={translate("home.create.title")} backgroundColor={"#475be8"}
                                              color={"#fcfcfc"} icon={<Add/>}
                                              handleClick={() => navigate('/all_institutions/create')}/>
                            </Stack>
                        </CanAccess>
                    </Box>

                    <Box mb={{xs: 1, sm: 2}} mt={1} width={"100%"}>
                        <Box display={"flex"} width={"100%"} gap={2} flexDirection={"column"} mb={{xs: '20px', sm: 0}}>
                            <FilterInstitutions
                                setByTags={setByTags}
                                filters={filters}
                                setFilters={setFilters}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                setSearchValue={setSearchValue}
                                sorters={sorters}
                                setSorters={setSorters}
                                byTags={byTags}
                                searchValue={searchValue}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%'
                            }}>
                                <Box component={Link}
                                     onClick={searchByValue}
                                     sx={{
                                         textDecoration: 'none',
                                         color: '#212042',
                                         transition: '300ms linear',
                                         borderBottom: !byTags ? '3px solid #212042' : '3px solid transparent',
                                         fontSize: {xs: '16px', md: '20px'}
                                     }}
                                >
                                    {translate("home.sortByType.all")}
                                </Box>
                                <Box component={Link}
                                     onClick={searchByValue}
                                     sx={{
                                         textDecoration: 'none',
                                         color: '#212042',
                                         transition: '300ms linear',
                                         borderBottom: byTags ? '3px solid #212042' : '3px solid transparent',
                                         fontSize: {xs: '16px', md: '20px'}
                                     }}
                                >
                                    {translate("home.tags")}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Grid container spacing={2}>
                {
                    isLoading ? <Loading/> :
                        allInstitutions.map((institution: PropertyProps | any) => (
                            <Grid
                                item
                                key={institution?._id}
                                xs={12}
                                sm={6}
                                lg={4}
                                xl={3}
                            >
                                <PropertyCard
                                    otherProps={setFavPlaces}
                                    key={institution._id}
                                    _id={institution._id}
                                    title={institution.title}
                                    place={institution.place}
                                    createdAt={institution.createdAt}
                                    description={institution.description}
                                    mainPhoto={institution.mainPhoto}
                                    otherPhoto={institution.otherPhoto}
                                    type={institution.type}
                                    createdBy={institution.createdBy}
                                    averageCheck={institution.averageCheck}
                                    contacts={institution.contacts}
                                    features={institution.features}
                                    location={institution.location}
                                    rating={institution?.rating}
                                    tags={institution.tags}
                                    verify={institution.verify}
                                    workSchedule={institution.workSchedule}
                                />
                            </Grid>
                        ))
                }
            </Grid>
            {/*<Box mt={{xs: '10px', sm: '20px'}}*/}
            {/*     sx={{display: "flex", flexWrap: "wrap", justifyContent: {xs: 'space-between', lg: 'start'}, gap: 2}}>*/}
            {/*    */}
            {/*</Box>*/}
            {
                allInstitutions.length > 0 && (
                    <Pagination current={current} setCurrent={setCurrent} pageCount={pageCount} setPageSize={setPageSize}/>
                )
            }
        </>
    );
};
export default UserList;
