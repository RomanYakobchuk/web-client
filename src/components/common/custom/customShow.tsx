import {EditButton} from "@refinedev/mui";
import {Show} from "@refinedev/antd";
import {useTranslate} from "@refinedev/core";
import {ArrowBackOutlined} from "@mui/icons-material";
import {Box, Typography as MuiTypography} from "@mui/material";
import {Breadcrumb} from "@refinedev/antd";
import React, {ReactNode, useContext} from "react";

import {ColorModeContext} from "../../../contexts";

import './custom.css';

interface IProps {
    isLoading: boolean,
    children: ReactNode,
    showButtons?: boolean,
    bgColor?: string
}

const CustomShow = ({isLoading, children, showButtons, bgColor}: IProps) => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    return (
        <Show
            isLoading={isLoading}
              contentProps={{
                  style: {
                      background: bgColor ? bgColor : mode === 'dark' ? "#3e3e36" : '#fff',
                      padding: '0',
                  },
              }}
              headerButtons={showButtons ?
                  [
                      <EditButton color={'secondary'} variant={'outlined'} key={'edit'}/>
                  ] : []
              }
              headerProps={{
                  title: <MuiTypography
                      sx={{
                          fontSize: '18px',
                          color: mode === 'dark' ? '#fcfcfc' : '#000'
                      }}
                  >{translate('buttons.details')}</MuiTypography>,
                  style: {
                      color: mode === 'dark' ? '#fcfcfc' : '#000',
                      padding: '10px',
                      maxWidth: '1100px',
                      margin: '0 auto'
                  },
                  backIcon: <ArrowBackOutlined sx={{
                      color: mode === 'dark' ? '#fcfcfc' : '#000'
                  }}/>
              }}
              breadcrumb={
                  <Box sx={{
                      color: mode === 'dark' ? '#fcfcfc' : '#000',
                      "& nav ol li > span": {
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          color: mode === 'dark' ? '#fcfcfc' : '#000'
                      },
                      "& nav ol li > span > div > a": {
                          color: mode === 'dark' ? '#d0c9c9' : '#2c2121'
                      },
                      "& nav ol li.ant-breadcrumb-separator": {
                          color: mode === 'dark' ? '#fcfcfc' : '#000'
                      }
                  }}>
                      <Breadcrumb breadcrumbProps={{
                          style: {
                              color: mode === 'dark' ? '#fcfcfc' : '#000'
                          }
                      }}/>
                  </Box>
              }
        >
            {children}
        </Show>
    );
};
export default CustomShow
