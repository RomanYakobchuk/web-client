import {Box, Button, SxProps} from "@mui/material";
import {Check} from "@mui/icons-material";

type TProps = {
    stepTitles: string[],
    currentStep: number,
    gotoStep: (step: number) => void,
    styleContainer?: SxProps
}
export const StepTitles = ({currentStep, stepTitles, styleContainer, gotoStep}: TProps) => {
    const goToNextStep = (index: number) => {
        if (index < 0) return;
        gotoStep(index)
    }
    return (
        <Box
            sx={{
                display: 'flex',
                // gap: 4,
                width: '90%',
                maxWidth: '300px',
                margin: '0 auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                color: 'common.black',
                ...styleContainer
            }}>
            {
                stepTitles?.map((title, index) => (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        order: index * 2
                    }}
                         key={index + title}
                    >
                        <Button
                            variant={'contained'}
                            color={(currentStep === index || currentStep > index) ? 'info' : 'secondary'}
                            sx={{
                                // bgcolor: currentStep === index ? '#12a5ee' : 'silver',
                                borderRadius: '50%',
                                textTransform: 'inherit',
                                fontWeight: 600,
                                fontSize: '16px',
                                transition: '300ms linear',
                                color: (currentStep === index || currentStep > index) ? '#f1f1f1' : 'common.black',
                                "&:hover": {
                                    bgcolor: '#12a5ee'
                                },
                                minWidth: '30px',
                                width: {xs: '40px', md: '50px'},
                                height: {xs: '40px', md: '50px'},
                            }}
                            onClick={() => goToNextStep(index)}
                        >
                            {
                                currentStep > index ? <Check/> : index + 1
                            }
                        </Button>
                        {/*<Box*/}
                        {/*    component="span"*/}
                        {/*    sx={{*/}
                        {/*        display: 'none',*/}
                        {/*        "@media screen and (min-width: 600px)": {*/}
                        {/*            display: 'flex'*/}
                        {/*        }*/}
                        {/*    }}>*/}
                        {/*    {title}*/}
                        {/*</Box>*/}
                    </Box>
                ))
            }
            {
                stepTitles?.map((_, index) => {
                    if (index === stepTitles?.length - 1) return;
                    return (
                        <Box sx={{
                            width: '100%',
                            height: '2px',
                            bgcolor: (currentStep === index + 1 || currentStep > index) ? 'cornflowerblue' : 'secondary.main',
                            order: index * 2 + 1
                        }}
                             key={index * 2 + 1}
                        />
                    );
                })
            }
        </Box>
    );
};

