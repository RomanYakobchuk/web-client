import {Marker, Popup} from "react-leaflet";
import {Link} from "react-router-dom";
import {Box} from "@mui/material";

import "./pin.scss";
import {IEstablishment} from "@/interfaces/common";
import {ESTABLISHMENT, SHOW} from "@/config/names";

type TProps = {
    item: IEstablishment
}
const Pin = ({item}: TProps) => {
    return (
        <Marker
            position={[item?.location?.lat, item?.location?.lng]}
        >
            <Popup>
                <Box
                    className={'pinMapPopupContainer'}
                >
                    <Box
                        component="img"
                        src={item?.pictures?.length > 0 ? item?.pictures[0]?.url : ''}
                        alt={'mapItemImage'}
                    />
                    <Box
                        className={'pinMapTextContainer'}
                    >
                        <Link to={`/${ESTABLISHMENT}/${SHOW}/${item?._id}`}>
                            {item?.title}
                        </Link>
                        <Box
                            component="span"
                        >
                            {item?.type}
                        </Box>
                        <Box
                            component="b"
                        >
                            ₴ {item?.averageCheck}
                        </Box>
                    </Box>
                </Box>
            </Popup>
        </Marker>
    );
};

export default Pin;