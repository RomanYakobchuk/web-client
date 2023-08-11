import {Box, Button, Grid, Typography} from "@mui/material";
import {IGetIdentity, IReserve, ProfileProps} from "../../interfaces/common";
import {Loading, PaginationComponent, ReservedCard} from "../index";
import React, {useContext} from "react";
import {CanAccess, useGetIdentity, useTable, useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";
import {ColorModeContext} from "../../contexts";
import {Edit} from "@mui/icons-material";

const UserList = () => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const navigate = useNavigate();

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
    })
    const reservations: IReserve[] | any = data?.data ?? [];


    if (isLoading) return <Loading/>
    if (isError) return <div>Error</div>
    return (
        <Box>
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
                        onClick={() => navigate(`/capl/create`)}
                    >
                        {translate('capl.title')}
                    </Button>

                </Box>
            </CanAccess>
            <Typography my={1}>
                {translate('capl.main.yourReserve')}
            </Typography>
            <Grid container spacing={2}>
                {
                    reservations?.map((item: IReserve, index: number) =>
                        <Grid
                            key={index}
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            xl={3}
                        >
                            <ReservedCard
                                key={index}
                                reserve={item}
                            />
                        </Grid>
                    )}
            </Grid>
            <PaginationComponent count={data?.total as number} current={current} setCurrent={setCurrent} pageCount={pageSize} setPageSize={setPageSize}/>
        </Box>
    )
        ;
};
export default UserList;
