import {ModalWindow} from "../../../components";
import {Box, Grid, Typography} from "@mui/material";
import React from "react";
import {useTranslate} from "@refinedev/core";

type IProps = {
    show: boolean,
    setShow: (value: boolean) => void
}

const UserAgreement = ({show, setShow}: IProps) => {
    const translate = useTranslate();
    return (
        <>
            {
                show && (
                    <ModalWindow
                        open={show}
                        contentProps={{
                            maxWidth: '90%',
                            height: '70vh',
                            borderRadius: '10px'
                        }}
                        setOpen={setShow}
                        title={
                            <Box sx={{
                                fontWeight: 700,
                                fontSize: {xs: '20px', md: '24px'}
                            }}>
                                {translate("agreement.title")}
                            </Box>
                        }>
                        <Grid container spacing={2} mt={5}>
                            <Grid item xs={12}>
                                <Typography sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    fontSize: "14px"
                                }}>
                                    {translate("agreement.text1")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    fontSize: "14px"
                                }}>
                                    {translate("agreement.text2")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    fontSize: "14px"
                                }}>
                                    {translate("agreement.text3")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ModalWindow>
                )
            }
        </>
    );
};
export default UserAgreement
