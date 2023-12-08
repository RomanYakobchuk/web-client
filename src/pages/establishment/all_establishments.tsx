import React from "react";

import {InstitutionsUserList, NewComponentButton} from "@/components";
import {Box} from "@mui/material";

const All_establishments = () => {

    return (
            <Box sx={{
                p: {xs: 0, sm: 1, md: 2}
            }}>
                <NewComponentButton link={'/all_institutions/create'} title={'home.create.title'}/>
                <InstitutionsUserList/>
            </Box>
    )
};
export default All_establishments;
