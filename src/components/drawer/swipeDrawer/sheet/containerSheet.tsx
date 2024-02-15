import cx from 'classnames/dedupe'
import {useEffect} from 'react'
import {useDetectEnv} from '../hooks'
import {Box, SxProps} from "@mui/material";

export default function ContainerSheet({
                                           children,
                                           className,
                                           styles
                                       }: {
    children: React.ReactNode
    className?: Parameters<typeof cx>[0],
    styles?: SxProps
}) {
    const env = useDetectEnv()
    useEffect(() => {
        const className = cx({
            'is-window': env === 'window',
            'is-iframe': env === 'iframe',
        })
        document.documentElement.classList.add(className)
        return () => {
            document.documentElement.classList.remove(className)
        }
    }, [env])

    return (
        <Box
            className={cx(
                'grid bg place-content-evenly min-h-screen fixed',
                className
            )}
            sx={{
                ...styles
            }}
        >
            {children}
        </Box>
    )
}