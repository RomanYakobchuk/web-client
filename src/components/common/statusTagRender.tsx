import {IReserve} from "@/interfaces/common";
import {TagField} from "@refinedev/mui";
import React from "react";
import {useTranslate} from "@refinedev/core";

const RenderTag = ({value}: {value: IReserve['userStatus']['value']}) => {

    const translate = useTranslate();

    const tagStyle = {
        fontSize: '15px',
        padding: '0px'
    }

    switch (value) {
        case "accepted":
            return (
                <TagField
                    style={{
                        ...tagStyle
                    }}
                    value={translate(`capl.status.${value}`)}
                    color={"success"}/>
            )
        case "draft":
            return (
                <TagField
                    style={{
                        ...tagStyle
                    }}
                    value={translate(`capl.status.${value}`)}
                    color={"info"}/>
            )
        case "rejected":
            return (
                <TagField
                    style={{
                        ...tagStyle
                    }}
                    value={translate(`capl.status.${value}`)}
                    color={"error"}/>
            )
        default:
            return (
                <TagField value={translate('text.nothing')}
                          style={{
                              ...tagStyle
                          }}
                          color={"default"}/>
            )
    }
}

export default RenderTag;