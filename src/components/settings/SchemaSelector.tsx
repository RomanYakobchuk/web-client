import {Box, Checkbox, FormControlLabel, FormGroup, Theme, Typography} from "@mui/material";
import {FC, useContext} from "react";
import {useSchema} from "../../settings";
import {Schema} from "../../settings/schema";
import {CheckCircle, RadioButtonUnchecked} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../contexts";


const SchemaSelector: FC = () => {
    const translate = useTranslate();
    const {schema, setSchema} = useSchema();
    const {mode} = useContext(ColorModeContext);
    const handleSchemaChange = (schema: Schema['type']) => {
        setSchema(schema);
    };
    const style = {
        width: '300px',
        height: '200px',
        borderRadius: '15px',
        border: '2px solid',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        transition: '300ms linear',
        "&:hover": {
            borderColor: (theme: Theme) => theme.palette.info.main
        }
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: '10px',
            borderRadius: '15px',
            // color: '#fff',
            bgcolor: mode === 'dark' ? '#254e6f' : '#e6d4c8',
        }}>
            <Typography variant="h6">{translate('schema.title')}:</Typography>
            <FormGroup sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                gap: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%'
            }}>
                <FormControlLabel
                    label={''}
                    control={
                        <Box sx={{
                            ...style,
                            borderColor: schema === 'schema_1' ? (theme) => theme.palette.info.main : mode === 'dark' ? 'white' : 'black'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                <Checkbox
                                    color={'info'}
                                    checkedIcon={<CheckCircle/>}
                                    icon={<RadioButtonUnchecked/>}
                                    checked={schema === 'schema_1'}
                                    onChange={() => handleSchemaChange('schema_1')}
                                />
                                <Typography>{translate('schema.schema_1')}</Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                margin: 'auto',
                                height: '120px',
                            }}>
                                <Box sx={{
                                    width: '40px',
                                    height: '100%',
                                    bgcolor: '#deaaaa',
                                    borderRight: '1px solid black'
                                }}/>
                                <Box sx={{
                                    height: '100%',
                                    width: '120px',
                                }}>
                                    <Box sx={{
                                        height: '20%',
                                        width: '100%',
                                        bgcolor: '#958787',
                                        borderBottom: '1px solid black'
                                    }}/>
                                    <Box sx={{
                                        height: '80%',
                                        width: '100%',
                                        bgcolor: '#ceb9b9'
                                    }}/>
                                </Box>
                            </Box>
                        </Box>
                    }
                />
                <FormControlLabel
                    label={''}
                    control={
                        <Box sx={{
                            ...style,
                            borderColor: schema === 'schema_2' ? (theme) => theme.palette.info.main : mode === 'dark' ? 'white' : 'black'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                <Checkbox
                                    color={'info'}
                                    checkedIcon={<CheckCircle/>}
                                    icon={<RadioButtonUnchecked/>}
                                    checked={schema === 'schema_2'}
                                    onChange={() => handleSchemaChange('schema_2')}
                                />
                                <Typography>{translate('schema.schema_2')}</Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                margin: 'auto',
                                gap: '5px',
                                height: '120px',
                            }}>
                                <Box sx={{
                                    width: '40px',
                                    height: '100%',
                                    bgcolor: '#deaaaa',
                                    borderRadius: '5px'
                                }}/>
                                <Box sx={{
                                    height: '100%',
                                    width: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px'
                                }}>
                                    <Box sx={{
                                        height: '20%',
                                        width: '100%',
                                        bgcolor: '#958787',
                                        borderRadius: '5px'
                                    }}/>
                                    <Box sx={{
                                        height: 'calc(80% - 5px)',
                                        width: '100%',
                                        bgcolor: '#ceb9b9',
                                        borderRadius: '5px'
                                    }}/>
                                </Box>
                            </Box>
                        </Box>
                    }
                />
            </FormGroup>
        </Box>
    );
};
export default SchemaSelector
