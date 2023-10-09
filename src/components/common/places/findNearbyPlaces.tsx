import {Box, Button, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslate} from "@refinedev/core";
import {useDebounce} from "use-debounce";
import {useInView} from "react-intersection-observer";
import {Input, Select, Space} from "antd";
import {Close, Delete, Edit} from "@mui/icons-material";
import {useNavigate, useSearchParams} from "react-router-dom";

import {PropertyProps} from "../../../interfaces/common";
import {Variant2EstablishmentCard} from "../../index";
import {useMobile} from "../../../hook";
import Loading from "../../loading/loading";
import {scrollBarStyle} from "../../../styles";
import {useLazyScrollLoading} from "../../../hook/useLazyScrollLoading";
import CustomOpenContentBtn from "../custom/CustomOpenContentBtn";
import ChangeLocation from "../google/changeLocation";
import {OPEN_NEARBY} from "../buttons/NearbyEstablishmentBtn";

interface IProps {
    location: {
        lat: number,
        lng: number
    },
    establishment?: PropertyProps
}

interface IAddress {
    address: string,
    city: string
}

type Unit = "km" | "m";

export interface INearbyF {
    openDrawer: boolean,
    location: IProps['location'],
    maxDistance: {
        value: number,
        unit: Unit
    }
}

const options = [
    {
        value: 'km',
        label: 'Km',
    },
    {
        value: 'm',
        label: 'M'
    }
];
const FindNearbyPlaces = ({location, establishment}: IProps) => {

    const translate = useTranslate();
    const {device} = useMobile();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [nearbyParsed, setNearbyParsed] = useState<INearbyF>({} as INearbyF);
    const [locationData, setLocationData] = useState<IAddress>({} as IAddress);
    const [currentLocation, setCurrentLocation] = useState<IProps['location']>(nearbyParsed?.location?.lat ? nearbyParsed?.location as IProps['location'] : location);
    const [currentEstablishment, setCurrentEstablishment] = useState<PropertyProps>({} as PropertyProps);
    const [data, setData] = useState<PropertyProps[]>([]);
    const [page, setPage] = useState<number>(1);
    const [maxDistance, setMaxDistance] = useState<INearbyF['maxDistance']>({
        value: nearbyParsed?.maxDistance?.value ? nearbyParsed?.maxDistance?.value : 5000,
        unit: nearbyParsed?.maxDistance?.unit ? nearbyParsed?.maxDistance?.unit as Unit : 'm'
    });
    const [debounceMaxDistance] = useDebounce(maxDistance, 500);
    const {
        data: resData,
        isFetching,
        isError,
        isLoading,
        count,
        updateOtherParams
    } = useLazyScrollLoading<PropertyProps>(
        '/institution/nearby',
        page,
        {
            maxDistance: debounceMaxDistance?.value,
            locationLng: currentLocation?.lng,
            locationLat: currentLocation?.lat,
            establishmentId: establishment?._id ?? ''
        }
    );

    useEffect(() => {
        const s = searchParams.get(OPEN_NEARBY);
        if (s) {
            setNearbyParsed(JSON.parse(s as string) as INearbyF)
        } else {
            setNearbyParsed({} as INearbyF)
        }
    }, [searchParams.get(OPEN_NEARBY)]);
    useEffect(() => {
        let searchLoc = {} as IProps['location'];
        if (nearbyParsed?.location) {
            searchLoc = nearbyParsed.location as IProps['location'];
        }
        if (!searchLoc?.lng && location?.lng && location?.lat) {
            setCurrentLocation(location)
        }
    }, [location?.lat, location?.lng, nearbyParsed?.location]);

    useEffect(() => {
        if ((debounceMaxDistance?.value && maxDistance?.unit) || (currentLocation?.lng && currentLocation?.lat)) {
            setPage(1)
            setData((_) => ([] as PropertyProps[]));
            updateOtherParams({
                maxDistance: maxDistance?.unit === 'km' ? maxDistance?.value * 1000 : maxDistance?.value,
                locationLng: currentLocation?.lng,
                locationLat: currentLocation?.lat,
                establishmentId: currentEstablishment?._id ?? ''
            })
        }
    }, [debounceMaxDistance?.value, currentLocation?.lat, currentLocation?.lng, maxDistance?.unit, setPage, setData, currentEstablishment?._id]);
    const {inView, ref} = useInView({
        threshold: 0.5
    });
    useEffect(() => {
        if (resData?.length > 0 && count > 0) {
            setData((prevState) => {
                return [...new Set([...prevState, ...resData]?.map((value) => JSON.stringify(value)))]?.map((value) => JSON.parse(value));
            })
        }
        if (count <= 0) {
            setData((_) => ([]))
        }
    }, [resData, isFetching, count]);

    useEffect(() => {
        if (establishment?._id) {
            setCurrentEstablishment(establishment)
        }
    }, [establishment?._id]);

    useEffect(() => {

        const prevSearchParams = searchParams.toString();
        console.log("all: ", nearbyParsed)
        console.log('nearbyF_P?.openDrawer: ', nearbyParsed?.openDrawer)
        if ((maxDistance?.unit || maxDistance?.value || currentLocation?.lat || currentLocation?.lng) && nearbyParsed?.openDrawer) {
            console.log('set nearby')
            searchParams.set(OPEN_NEARBY, JSON.stringify({
                ...nearbyParsed,
                maxDistance: {
                    value: maxDistance?.value,
                    unit: maxDistance?.unit
                },
                location: currentLocation as IProps['location']
            } as INearbyF))
        }
        if (!nearbyParsed?.openDrawer) {
            navigate(-1)
        }
        if (prevSearchParams !== searchParams.toString()) {
            setSearchParams(searchParams)
        }
    }, [maxDistance, currentLocation, nearbyParsed]);
    useEffect(() => {
        if (data.length > 0 && inView && isFetching) {
            setPage((prevState) => prevState += 1);
        }
    }, [inView, data.length, isFetching]);

    const barStyle = !device ? scrollBarStyle : {};

    useEffect(() => {

        console.log('before set value')
        if (nearbyParsed?.openDrawer) {
            const searchMaxD_V = nearbyParsed?.maxDistance?.value as number;
            const searchMaxD_U = nearbyParsed?.maxDistance?.unit as Unit;
            const searchLoc = nearbyParsed?.location as IProps['location'];
            if (searchLoc?.lng && searchLoc?.lng) {
                setCurrentLocation(searchLoc);
            }
            if (searchMaxD_U && searchMaxD_V) {
                setMaxDistance({unit: searchMaxD_U, value: searchMaxD_V});
            }
            console.log('after set value')
        }
    }, [nearbyParsed]);

    const handleReset = () => {
        setCurrentLocation(location)
        setMaxDistance({unit: 'm', value: 5000})
        if (establishment?._id) {
            setCurrentEstablishment(establishment)
        }
    }
    const handleClearEstablishment = () => {
        setCurrentEstablishment({} as PropertyProps)
    }

    const disabled = currentLocation?.lng !== location?.lng || currentLocation?.lat !== location?.lat || maxDistance?.unit !== 'm' || maxDistance?.value !== 5000 || (establishment?._id !== currentEstablishment?._id);
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            overflowY: 'auto',
            flexDirection: 'column',
            gap: 2,
            ...barStyle
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Space
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Space.Compact>
                        <Input
                            onChange={(event) => setMaxDistance((prevState) => ({
                                ...prevState,
                                value: Number(event.target.value)
                            }))}
                            value={maxDistance.value ? maxDistance.value : 0}
                        />
                        <Select
                            value={maxDistance.unit ? maxDistance.unit : 'm'}
                            onChange={(value) => setMaxDistance((prevState) => ({...prevState, unit: value}))}
                            dropdownStyle={{
                                zIndex: 2000
                            }}
                        >
                            {
                                options.map((option, index) => (
                                    <Select.Option
                                        key={index}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Space.Compact>
                    <Button
                        disabled={!disabled}
                        variant={'contained'}
                        color={'warning'}
                        sx={{
                            height: '32px',
                            textTransform: 'capitalize',
                            fontSize: {xs: '14px', sm: '16px', md: '18px'}
                        }}
                        onClick={handleReset}
                    >
                        {translate('buttons.reset')}
                    </Button>
                </Space>
                <CustomOpenContentBtn
                    openEndIcon={<Edit/>}
                    closeEndIcon={<Close/>}
                    openText={
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}
                            component={'span'}
                        >
                            {translate('home.create.location.title')}
                            {
                                locationData?.city &&
                                <span style={{fontSize: '12px', color: 'silver'}}>({locationData.city})</span>
                            }
                        </Box>
                    }
                    closeText={translate('buttons.hide')}
                >
                    <ChangeLocation
                        location={currentLocation}
                        setLocation={setCurrentLocation}
                        setPlace={setLocationData}
                        place={locationData}
                        isReadOnly={true}
                    />
                </CustomOpenContentBtn>
                {
                    currentEstablishment?._id && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'start'
                        }}>
                            <Button
                                startIcon={<Delete/>}
                                variant={'contained'}
                                color={'error'}
                                sx={{
                                    textTransform: 'capitalize',
                                    display: 'flex',
                                    gap: 0.5,
                                    alignItems: 'center',
                                    fontSize: {xs: '14px', sm: '16px', md: '18px'}
                                }}
                                onClick={handleClearEstablishment}
                            >
                                {translate('buttons.clear')}
                                <span style={{textTransform: 'lowercase'}}>{translate('home.one')}</span>
                            </Button>
                            <Box sx={{
                                display: 'flex',
                                gap: 2
                            }}>
                                {
                                    currentEstablishment?.pictures?.length > 0 && (
                                        <Box sx={{
                                            width: {xs: '130px', sm: '200px', md: '250px'},
                                            height: {xs: '100px', sm: '150px', md: '190px'},
                                        }}>
                                            <img
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px'
                                                }}
                                                src={currentEstablishment?.pictures[0]?.url}
                                                alt={currentEstablishment?.pictures[0]?.name}
                                            />
                                        </Box>
                                    )
                                }
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography
                                        variant={'h6'}
                                    >
                                        {currentEstablishment?.title}
                                    </Typography>
                                    <Typography
                                        variant={'subtitle2'}
                                    >
                                        {currentEstablishment?.place?.city}
                                    </Typography>
                                    <Typography
                                        variant={'subtitle2'}
                                    >
                                        {currentEstablishment?.place?.address}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <Box sx={{
                width: '100%',
                paddingRight: '5px',
                marginRight: '-5px',
                display: 'flex',
                flexDirection: 'column',
                gap: {xs: 0, sm: 1}
            }}>
                {
                    isError ? <div>Error</div> :
                        data?.map((value) => (
                            <Variant2EstablishmentCard
                                key={value._id}
                                establishment={value}
                            />
                        ))
                }
                {
                    isLoading && <Loading height={'50px'}/>
                }
                {
                    data &&
                    <Box sx={{
                        width: '100%',
                    }}
                         ref={ref}
                    />
                }
                {/*{*/}
                {/*    isRefetching ? <Loading height={'300px'}/> : (*/}
                {/*        items.map((item, index) => (*/}
                {/*            <Box key={index}>*/}

                {/*            </Box>*/}
                {/*        ))*/}
                {/*    )*/}
                {/*}*/}
            </Box>
        </Box>
    );
};
export default FindNearbyPlaces;
