import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import React, {SyntheticEvent, useState} from "react";


type TProps = {
    title: string,
    children: any,
    id: string,
    bgColor?: string
}
const CustomAccordion = ({title, children, id, bgColor = 'common.black'}: TProps) => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange =
        (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <Accordion expanded={expanded === id} sx={{
            mt: '10px',
            borderRadius: '10px',
            width: '100%',
            bgcolor: bgColor
        }} onChange={handleChange(id)}>
            <AccordionSummary
                sx={{
                    width: '100%'
                }}
                expandIcon={<ExpandMore/>}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
            >
                <Typography fontSize={18} fontWeight={600}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    width: '100%',
                    backgroundColor: 'common.black',
                    "& > div":{
                        bgcolor: 'transparent'
                    },
                    height: children ? '100%' : '100px',
                    display: 'flex',
                    p: {xs: 0, sm: 'auto'},
                    maxHeight: children ? {xs: '500px', sm: '750px'} : '100px',
                    overflowY: 'auto',
                    "&::-webkit-scrollbar": {
                        height: '10px',
                        borderRadius: '5px',
                        bgcolor: 'transparent'
                    },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: 'silver',
                        borderRadius: '10px'
                    }
                }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};
export default CustomAccordion
