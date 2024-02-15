import {Box, Button} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";

type TProps = {
    link: string
}
const DetailsButton = ({link}: TProps) => {
    const navigate = useNavigate();
    const translate = useTranslate();

    const handleNavigate = () => {
        navigate(link)
    }
    return (
        <Box sx={{
            width: 'fit-content',
            margin: '0 auto'
        }}>
            <Button
                onClick={handleNavigate}
                color={'secondary'}
                variant={'contained'}
                sx={{
                    fontSize: {xs: '22px', md: '26px'},
                    textTransform: 'inherit',
                    color: 'common.black',
                    borderRadius: '30px',
                    p: '0px 40px'
                }}
            >
                {translate('buttons.details')}
            </Button>
        </Box>
    );
};

export default DetailsButton;