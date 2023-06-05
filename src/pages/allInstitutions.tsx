import {CanAccess} from "@refinedev/core";

import {
    InstitutionsAdminList,
    InstitutionsUserList,
} from "../components";

const AllInstitutions = () => {
    return (
        <>
            <CanAccess resource={'institutions'} action={'userListInstitutions'}>
                <InstitutionsUserList/>
            </CanAccess>
            <CanAccess resource={'institutions'} action={'adminListInstitutions'}>
                <InstitutionsAdminList/>
            </CanAccess>
        </>
    )
};
export default AllInstitutions;
