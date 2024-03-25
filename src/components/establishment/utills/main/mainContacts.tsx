import {IEstablishment} from "@/interfaces/common";
import {useTranslate} from "@refinedev/core";
import {Box, Typography} from "@mui/material";
import React from "react";

type TProps = {
    contacts: IEstablishment['contacts']
}
export const MainContacts = ({contacts}: TProps) => {
    const translate = useTranslate();
    return (
        <Box sx={{
            width: '100%',
            // borderBottom: '1px solid silver'
        }}>
            <Typography>
                {translate("home.create.contacts")}
            </Typography>
            <Box sx={{
                ml: 1,
                mt: 1
            }}>
                {
                    contacts?.map((contact: any, index: number) => (
                        <Box key={index}>
                            {contact?.value}
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
};

