import {Box} from "@mui/material";
import {ShowTimeComponent} from "@/components/time";
import React from "react";
import {useTranslate} from "@refinedev/core";
import {IReserve} from "@/interfaces/common";

type TProps = {
    reservation: IReserve
}
const MainInfo = ({reservation}: TProps) => {

    const {numberPeople, date, fullName} = reservation;

    const translate = useTranslate();

    return (
        <Box sx={{
            m: '20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            fontSize: {xs: '16px', md: '18px'},
            "& div > div.newReservationInfo": {
                ml: '20px',
                fontSize: '20px',
                fontWeight: 600
            }
        }}>
            <Box>
                {translate('capl.create.fullName')}:
                <Box
                    className={'newReservationInfo'}
                >
                    {fullName}
                </Box>
            </Box>
            <Box>
                {translate('capl.create.date')}:
                <Box
                    className={'newReservationInfo'}
                >
                    <ShowTimeComponent
                        isFirstAgo={false}
                        style={{
                            width: 'fit-content',
                            alignItems: 'start',
                            fontSize: '20px',
                            fontWeight: 600
                        }}
                        date={date as Date}/>
                </Box>
            </Box>
            <Box>
                {translate('capl.create.numberPeople')}:
                <Box
                    className={'newReservationInfo'}
                >
                    {numberPeople}
                </Box>
            </Box>
        </Box>
    );
};
export default MainInfo
