import cx from 'classnames'
import {forwardRef, ReactNode, PropsWithoutRef, useContext} from 'react'
import styles from './sheetContent.module.css'
import {Box} from "@mui/material";
import {ColorModeContext} from "@/contexts";

type Props = {
    children: ReactNode
} & Omit<PropsWithoutRef<JSX.IntrinsicElements['div']>, 'children'>

const SheetContent = forwardRef<HTMLDivElement, Props>(
    ({className, ...props}: Props, ref) => {
        return (
            <Box
                className={cx(
                    styles.spacing,
                    'grid grid-flow-row place-items-start text-gray-900 text-xl',
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