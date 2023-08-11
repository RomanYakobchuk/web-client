import React, {useContext, useState} from "react";
import {Button, Chip, Grid, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import {ColorModeContext} from "../../../contexts";
import {buttonStyle, textFieldStyle} from "../../../styles";


type Props = {
    elements: string[] | any;
    setData: any;
    label: string
};


const InputList = ({elements, setData, label}: Props) => {
    const [item, setItem] = useState<any>("");

    const {mode} = useContext(ColorModeContext);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem(e.target.value);
    };
    const handleAddData = (element: string | any) => {
        setData([...elements, element])
    }

    const handleAddNumber = () => {
        if (item) {
            handleAddData({value: item});
            setItem("");
        }
    };
    const handleDeleteData = (index: number | any) => {
        setData(elements.filter((_: any, i: any) => i !== index));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} gap={2} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TextField
                    label={label}
                    variant="outlined"
                    fullWidth
                    value={item ? item : ''}
                    color={"secondary"}
                    size={"small"}
                    sx={textFieldStyle}
                    type={"text"}
                    onChange={handleInputChange}
                />
                <Button
                    sx={buttonStyle}
                    variant="contained" color={"info"} onClick={handleAddNumber}>
                    <Add />
                </Button>
            </Grid>
            <Grid item xs={12}>
                {elements?.map((element: any, index: any) => (
                    <Chip
                        key={index}
                        label={element.value}
                        onDelete={() => handleDeleteData(index)}
                        size={"small"}
                        sx={{
                            p: "5px",
                            fontSize: '16px',
                            m: 0.5,
                            color: (theme) => theme.palette.secondary.main,
                            borderColor: mode === "dark" ? '#fcfcfc' : '#314d63'
                        }}
                        variant="outlined"
                    />
                ))}
            </Grid>
        </Grid>
    );
};

export default InputList;
