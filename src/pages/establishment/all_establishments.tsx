import {CanAccess, useTranslate} from "@refinedev/core";
import {Box, Button, Stack} from "@mui/material";

import {
    InstitutionsAdminList,
    InstitutionsUserList,
} from "../../components";
import React, {useState} from "react";
import {useRole} from "../../utils";
import {Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const All_establishments = () => {
    const {role} = useRole();
    const navigate = useNavigate();
    const translate = useTranslate();
    const [showUserList, setShowUserList] = useState(true);
    return (
        <Box sx={{
            p: {xs: 1, md: 2}
        }}>
            {
                role === 'admin' &&
                <Box sx={{
                    width: 'fit-content',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                }}>
                    <Button color={showUserList ? 'info' : 'inherit'}
                            onClick={() => setShowUserList(true)}>UserList</Button>
                    <Button color={showUserList ? 'inherit' : 'info'}
                            onClick={() => setShowUserList(false)}>AdminList</Button>
                </Box>
            }
            <CanAccess resource={"all_institutions"} action={"create"}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Button
                        color={"info"} variant={"contained"}
                        startIcon={<Add/>}
                        sx={{
                            height: '100%'
                        }}
                        onClick={() => navigate('/all_institutions/create')}>
                        {translate("home.create.title")}
                    </Button>
                </Stack>
            </CanAccess>
            {
                role === 'admin' ? (
                    !showUserList ?
                        <CanAccess resource={'institutions'} action={'adminListInstitutions'}>
                            <InstitutionsAdminList/>
                        </CanAccess>
                        :
                        <CanAccess resource={'institutions'} action={'userListInstitutions'}>
                            <InstitutionsUserList/>
                        </CanAccess>
                ) : (
                    <CanAccess resource={'institutions'} action={'userListInstitutions'}>
                        <InstitutionsUserList/>
                    </CanAccess>
                )
            }
        </Box>
    )
};
export default All_establishments;
