import React, {Dispatch, FC, SetStateAction, useContext} from "react";
import {ColorModeContext} from "@/contexts";
import MDEditor, {commands, EditorContext, ICommand,} from "@uiw/react-md-editor";
import {Box, Button, SxProps} from "@mui/material";
import {useTranslate} from "@refinedev/core";

type TProps = {
    value: string,
    setValue: Dispatch<SetStateAction<string>> | ((value?: string) => void),
    isDefaultStyles?: boolean,
    styles?: SxProps,
    placeholder?: string
}
export const CustomMDEditor = ({value, setValue, isDefaultStyles = true, styles, placeholder = 'Enter your text'}: TProps) => {
    const {mode} = useContext(ColorModeContext);

    const defStyles = !isDefaultStyles ? {
        "& div.w-md-editor": {
            borderRadius: '10px',
            overflow: 'hidden'
        },
        width: '100%',
        "& .w-md-editor-toolbar": {
            p: 1,
            flexDirection: 'column-reverse',
            alignItems: 'start',
            justifyContent: 'center',
            gap: 1,
            "& ul": {
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flexWrap: 'wrap'
            },
            "& li > button": {
                height: '30px',
                "& svg": {
                    height: '18px',
                    width: '18px',
                },
            },
            "& > ul:nth-of-type(2)": {
                p: 1,
                bgcolor: 'modern.modern_2.second',
                borderRadius: '7px'
            },
            "& > ul:nth-of-type(1)": {
                p: 1,
                width: '100%',
                bgcolor: 'modern.modern_2.second',
                boxShadow: '0 0 2px 1px silver',
                borderRadius: '7px'
            }
        }
    } : {};
    const editBtn = isDefaultStyles ? commands.codeEdit : customCodeEditButton;
    const previewBtn = isDefaultStyles ? commands.codePreview : customCodePreviewButton;

    const onChangeSetValue = (v?: string) => {
        setValue(v as string)
    }
    return (
        <Box
            sx={{
                "& .w-md-editor-fullscreen":{
                    top: {xs: '55px', sm: '60px'}
                },
                ...defStyles,
                ...styles
            }}
        >
            <MDEditor
                textareaProps={{
                    placeholder: placeholder
                }}
                data-color-mode={mode === "dark" ? 'dark' : 'light'}
                value={value ? value : ''}
                onChange={(value) => onChangeSetValue(value)}
                preview={'edit'}
                commands={[
                    commands.group([
                        commands.title,
                        commands.title1,
                        commands.title2,
                        commands.title3,
                        commands.title4,
                        commands.title5,
                        commands.title6,
                    ], {
                        name: 'title',
                        groupName: 'title',
                        buttonProps: {'aria-label': 'Insert title'}
                    }),
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.divider,
                    commands.link,
                    commands.quote,
                    commands.code,
                    commands.codeBlock,
                    commands.comment,
                    commands.divider,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                    commands.divider,
                    commands.help,
                ]}
                extraCommands={[
                    editBtn,
                    previewBtn,
                    commands.fullscreen
                ]}
            />
        </Box>
    );
};
const CodeEditButton: FC = () => {
    const translate = useTranslate();
    const {dispatch, preview} = useContext(EditorContext);
    const handleClick = () => {
        if (dispatch) {
            dispatch({
                preview: 'edit'
            })
        }
    }
    return (
        <Button
            variant={'text'}
            sx={{
                bgcolor: preview === 'edit' ? '#2874CB !important' : 'inherit',
                color: preview === 'edit' ? '#f9f9f9 !important' : 'inherit',
                px: '16px !important',
                py: '8px !important',
                borderRadius: '4px !important',

            }}
            onClick={handleClick}
        >
            {translate('text.write')}
        </Button>
    )
}
const customCodeEditButton: ICommand = {
    name: "preview",
    keyCommand: '"preview',
    value: "preview",
    icon: <CodeEditButton/>,
}
const CodePreviewButton: FC = () => {
    const translate = useTranslate();
    const {dispatch, preview} = useContext(EditorContext);
    const handleClick = () => {
        if (dispatch) {
            dispatch({
                preview: 'preview'
            })
        }
    }
    return (
        <Button
            variant={'text'}
            sx={{
                bgcolor: preview === 'preview' ? '#2874CB !important' : 'inherit',
                color: preview === 'preview' ? '#f9f9f9 !important' : 'inherit',
                px: '16px !important',
                py: '8px !important',
                borderRadius: '4px !important',

            }}
            onClick={handleClick}
        >
            {translate('text.preview')}
        </Button>
    )
}
const customCodePreviewButton: ICommand = {
    name: "preview",
    keyCommand: '"preview',
    value: "preview",
    icon: <CodePreviewButton/>,
}
