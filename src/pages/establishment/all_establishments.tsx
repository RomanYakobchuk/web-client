import {CanAccess} from "@refinedev/core";
import {Box, Button} from "@mui/material";

import {
    InstitutionsAdminList,
    InstitutionsUserList, NewComponentButton,
} from "../../components";
import React, {useState} from "react";
import {useRole} from "../../hook";

const All_establishments = () => {
    const {role} = useRole();
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
            <NewComponentButton link={'/all_institutions/create'} title={"home.create.title"}/>
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
