import {Box, Button} from "@mui/material";
import {Edit} from "@mui/icons-material";
import React, {useContext} from "react";
import {CanAccess} from "@refinedev/core";

import {ColorModeContext} from "../contexts";
import {CaplUserList, CaplManagerList} from "../components";

const Capl = () => {
    const {mode} = useContext(ColorModeContext);

    return (
        <Box mt={{xs: '10px', sm: '20px'}} borderRadius="15px" padding="10px"
             bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}
        >
            <CanAccess resource={'capl'} action={'userListReserve'}>
                <CaplUserList/>
            </CanAccess>
            <CanAccess resource={'capl'} action={'managerListReserve'}>
                <CaplManagerList/>
            </CanAccess>
        </Box>
    );
};

export default Capl