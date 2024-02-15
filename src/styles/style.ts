export const textFieldStyle = {
    "& div": {
        borderRadius: '10px',
    },
}

export const buttonStyle = {
    borderRadius: '7px',
    height: '40px',
    textTransform: 'capitalize',
    "&:hover": {
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

export const scrollBarStyle = {
    '&::-webkit-scrollbar': {
        width: '7px',
        bgcolor: 'transparent',
        borderRadius: '5px'
    },
    '&::-webkit-scrollbar-track': {
        'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey',
        bgcolor: 'steelblue',
        borderRadius: '5px',
    }
}
