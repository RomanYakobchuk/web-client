export const textFieldStyle = {
    "& div": {
        borderRadius: '10px'
    }
}

export const buttonStyle = {
    borderRadius: '7px',
    height: '40px',
    textTransform: 'capitalize',
    "&:hover":{
        bgcolor: 'unset',
        color: 'unset'
    }
}

export const hoverButtonStyle = {
    "&:hover": {
        color: 'common.white',
        bgcolor: 'common.black'
    }
}

export const tagStyle = {
    borderRadius: '20px'
}

export const selectStyle = {
    borderRadius: '10px'
}

export const antdInputStyle = {
    "& input.ant-input": {
        bgcolor: 'transparent !important',
        color: 'common.white',
        "&::placeholder": {
            color: 'common.white'
        }
    }
}