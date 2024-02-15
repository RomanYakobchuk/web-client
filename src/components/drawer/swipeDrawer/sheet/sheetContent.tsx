import cx from 'classnames'
import {forwardRef, ReactNode, PropsWithoutRef} from 'react'
import styles from './sheetContent.module.css'
import {Box} from "@mui/material";

type Props = {
    children: ReactNode
} & Omit<PropsWithoutRef<JSX.IntrinsicElements['div']>, 'children'>

const SheetContent = forwardRef<HTMLDivElement, Props>(
    ({className, ...props}: Props, ref) => {
        return (
            <Box
                className={cx(
                    styles.spacing,
                    'grid grid-flow-row place-items-start',
                    'pb-8 px-8 pt-4 gap-4',
                    className
                )}
                {...props}
                ref={ref}
            />
        )
    }
)

export default SheetContent