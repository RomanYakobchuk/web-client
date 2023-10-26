import {Button, Stack} from "@mui/material";
import {Add} from "@mui/icons-material";
import {CanAccess, useTranslate} from "@refinedev/core";
import React from "react";
import {useNavigate} from "react-router-dom";

type TProps = {
    link: string,
    title: string
}
const NewComponentButton = ({link, title}: TProps) => {

    const translate = useTranslate();
    const navigate = useNavigate();

    return (
        <CanAccess resource={"news"} action={"create"}>
            <Stack direction={"row"} m={'10px auto'} maxWidth={'1200px'} justifyContent={"end"} alignItems={"center"}>
                <Button
                    color={"info"} variant={"contained"}
                    startIcon={<Add/>}
                    sx={{
                        borderRadius: '7px',
                        height: '40px',
                        textTransform: 'inherit',
                    }}
                    onClick={() => navigate(link)}>
                    {translate(title)}
                </Button>
            </Stack>
        </CanAccess>
    );
};
export default NewComponentButton
