import React from "react";

import {InstitutionsUserList} from "@/components";
import {Box} from "@mui/material";

const All_establishments = () => {

    return (
            <Box sx={{
                p: {xs: 0, sm: 1, md: 2}
            }}>
                <InstitutionsUserList/>
            </Box>
    )
};
export default All_establishments;
