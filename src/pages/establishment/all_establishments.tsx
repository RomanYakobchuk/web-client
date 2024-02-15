import React from "react";

import {EstablishmentsUserList, NearbyEstablishmentBtn, NewComponentButton} from "@/components";
import {Box} from "@mui/material";
import {CREATE, ESTABLISHMENT} from "@/config/names";
import {PropertyProps} from "@/interfaces/common";
import {usePosition} from "@/hook";

const All_establishments = () => {
    const {position, error} = usePosition();

    return (
        <Box sx={{
            p: {xs: 0, sm: 1, md: 2}
        }}>
            <Box sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                flexWrap: 'wrap',
                p: {xs: 1, sm: 0},
                mb: {sm: 2}
            }}>
                <NearbyEstablishmentBtn
                    error={error}
                    location={position as PropertyProps['location']}/>
                <NewComponentButton link={`/${ESTABLISHMENT}/${CREATE}`} title={'home.create.title'}/>
            </Box>
            <EstablishmentsUserList/>
        </Box>
    )
};
export default All_establishments;
