import {Box, Button, CircularProgress} from "@mui/material";
import React, {BaseSyntheticEvent, useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {buttonStyle} from "@/styles";
import {ColorModeContext} from "@/contexts";

type TProps = {
    currentStep: number,
    stepTitles: string[],
    gotoStep: (step: number) => void,
    formLoading?: boolean,
    onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>,
    textSubmit?: string
}
export const StepButtons = ({currentStep, stepTitles, gotoStep, formLoading = false, onSubmit, textSubmit}: TProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    if (!textSubmit) textSubmit = translate("pages.register.buttons.submit");
    return (
        <Box sx={{
            display: 'flex',
            gap: 4,
            "& button:not(:nth-of-type(3))": {
                borderWidth: '2px !important',
                textTransform: 'inherit',
                borderRadius: '10px',
                p: '5px 20px'
            }
        }}>
            {currentStep > 0 && (
                <Button
                    variant={'outlined'}
                    color={'warning'}
                    onClick={(event) => {
                        event.preventDefault();
                        gotoStep(currentStep - 1);
                    }}
                >
                    {translate('buttons.steps.previous')}
                </Button>
            )}
            {currentStep < stepTitles.length - 1 && (
                <Button
                    variant={'outlined'}
                    color={'info'}
                    onClick={(event) => {
                        event.preventDefault();
                        gotoStep(currentStep + 1);
                    }}
                >
                    {translate('buttons.steps.next')}
                </Button>
            )}
            {
                currentStep === stepTitles?.length - 1 && (
                    <Button
                        type={"submit"}
                        variant={'contained'}
                        color={mode === "dark" ? "info" : "secondary"}
                        sx={{
                            ...buttonStyle,
                            fontSize: '18px',
                            width: '100%',
                            maxWidth: '300px',
                            margin: '0 auto'
                        }}
                        onClick={onSubmit}
                    >
                        {
                            formLoading ? <CircularProgress/> :
                                textSubmit
                        }
                    </Button>
                )
            }
        </Box>
    );
};

