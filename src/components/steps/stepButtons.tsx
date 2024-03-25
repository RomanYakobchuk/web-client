import {Box, Button, CircularProgress, SxProps} from "@mui/material";
import React, {BaseSyntheticEvent, ReactNode, useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "@/contexts";
import {NavigateBefore, NavigateNext} from "@mui/icons-material";

type TProps = {
    currentStep: number,
    stepTitles: string[],
    gotoStep: (step: number) => void,
    formLoading?: boolean,
    onSubmit: ((e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>) | (() => void),
    textSubmit?: string | ReactNode,
    buttonsVariant?: "text" | "contained" | "outlined" | undefined,
    styles?: SxProps
}
export const StepButtons = ({
                                currentStep,
                                stepTitles,
                                gotoStep,
                                formLoading = false,
                                onSubmit,
                                textSubmit,
                                buttonsVariant = 'outlined',
                                styles
                            }: TProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    if (!textSubmit) textSubmit = translate("pages.register.buttons.submit");
    return (
        <Box sx={{
            display: 'flex',
            gap: 4,
            width: '100%',
            justifyContent: 'end',
            // "& button:not(:nth-of-type(3))": {
            "& button": {
                borderWidth: '2px !important',
                textTransform: 'inherit',
                borderRadius: '7px',
                p: '5px 16px',
            },
            ...styles
        }}>
            {currentStep > 0 && (
                <Button
                    variant={buttonsVariant}
                    color={'warning'}
                    onClick={(event) => {
                        event.preventDefault();
                        gotoStep(currentStep - 1);
                    }}
                    startIcon={<NavigateBefore/>}
                >
                    {translate('buttons.steps.previous')}
                </Button>
            )}
            {currentStep < stepTitles.length - 1 && (
                <Button
                    variant={buttonsVariant}
                    color={'info'}
                    onClick={(event) => {
                        event.preventDefault();
                        gotoStep(currentStep + 1);
                    }}
                    endIcon={<NavigateNext/>}
                >
                    {translate('buttons.steps.next')}
                </Button>
            )}
            {
                currentStep === stepTitles?.length - 1 && (
                    <Button
                        type={"submit"}
                        variant={buttonsVariant}
                        color={mode === "dark" ? "info" : "secondary"}
                        sx={{
                            // ...buttonStyle,
                            fontSize: {xs: '16px', md: '18px'},
                            width: 'fit-content',
                            maxWidth: '200px',
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

