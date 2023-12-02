
import React from "react";
import {CanAccess} from "@refinedev/core";

import {CaplUserPage, CaplManagerPage} from "@/components";
import { Box } from "@mui/material";

const Capl = () => {

    return (
        <Box
            sx={{
                p: '10px'
            }}
        >
            <CanAccess resource={'capl'} action={'userListReserve'}>
                <CaplUserPage/>
            </CanAccess>
            <CanAccess resource={'capl'} action={'managerListReserve'}>
                <CaplManagerPage/>
            </CanAccess>
        </Box>
    );
};

export default Capl