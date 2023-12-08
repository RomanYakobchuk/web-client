import {Box, Button, Typography} from "@mui/material";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useInfiniteList, useTranslate} from "@refinedev/core";
import {useDebounce} from "use-debounce";
import {Input, Select, Space} from "antd";
import {Close, Delete, Edit} from "@mui/icons-material";

import {PropertyProps} from "@/interfaces/common";
import {useMobile} from "@/hook";
import Loading from "../../loading/loading";
import {scrollBarStyle} from "@/styles";
import CustomOpenContentBtn from "../custom/CustomOpenContentBtn";
import ChangeLocation from "../google/changeLocation";
import PropertiesList from "../../establishment/utills/lists/propertiesList";
import MoreButton from "../buttons/MoreButton";
import VariantComponent from "../buttons/variantComponent";
import LottieComponent from "@/lotties/LottieComponent";
import RadarLottie from "@/lotties/properties/radar.json";

type TProps = {
    location: {
        lat: number,
        lng: number
    },
    establishment?: PropertyProps,
    setOpenDrawer: Dispatch<SetStateAction<boolean>>
}

type TAddress = {
    address: string,
    city: string
}

type Unit = "km" | "m";

export type TNearbyF = {
    openDrawer: boolean,
    location: TProps['location'],
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
const FindNearbyPlaces = ({location, establishment, setOpenDrawer}: TProps) => {

    const translate = useTranslate();
    const {device} = useMobile();

    const [locationData, setLocationData] = useState<TAddress>({} as TAddress);
    const [currentLocation, setCurrentLocation] = useState<TProps['location']>(location);
    const [currentEstablishment, setCurrentEstablishment] = useState<PropertyProps>({} as PropertyProps);
    const [establishmentList, setEstablishmentList] = useState<PropertyProps[]>([]);
    const [maxDistance, setMaxDistance] = useState<TNearbyF['maxDistance']>({
        value: 5000,
        unit: 'm'
    });
    const [debounceMaxDistance] = useDebounce(maxDistance, 500);

    const {data, isLoading, isError, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage} = useInfiniteList({
        resource: 'institution/nearby',
        filters: [
            {
                value: maxDistance?.unit === 'km' ? debounceMaxDistance?.value * 1000 : debounceMaxDistance?.value,
                field: 'maxDistance',
                operator: 'eq'
            },
            {
                value: currentLocation?.lng,
                field: 'locationLng',
                operator: 'eq'
            },
            {
                value: currentLocation?.lat,
                field: 'locationLat',
                operator: 'eq'
            },
            {
                value: currentEstablishment?._id ?? '',
                field: 'establishmentId',
                operator: 'eq'
            },
        ],
        pagination: {
            pageSize: 10
        }
    });
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    useEffect(() => {
        if (location?.lng && location?.lat) {
            setCurrentLocation(location)
        }
    }, [location?.lat, location?.lng]);

    // const {inView, ref} = useInView({
    //     threshold: 0.5
    // });
    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: PropertyProps[],
                total: number
            }) => page?.data ?? [])));
            setEstablishmentList(list);
        }
    }, [data]);

    useEffect(() => {
        if (establishment?._id) {
            setCurrentEstablishment(establishment)
        }
    }, [establishment?._id]);

    const barStyle = !device ? scrollBarStyle : {};

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
                            value={maxDistance?.value ? maxDistance?.value : 0}
                        />
                        <Select
                            value={maxDistance?.unit ? maxDistance?.unit : 'm'}
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
                display: 'flex',
                justifyContent: 'end'
            }}>
                <VariantComponent type={"establishment"}/>
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
                    (isLoading || isFetching)
                        ?
                        <Box>
                            <LottieComponent size={250} loop={true} isClickToStartAnimation={false} item={RadarLottie}/>
                        </Box>
                        // <Loading height={'200px'}/>
                        : isError ? <div>Something went wrong (((</div>
                            : establishmentList?.length > 0 && (
                            <PropertiesList
                                numberOfColumnsByWidth={innerWidth < 500 ? 1 : 2}
                                items={establishmentList}
                                setIsOpen={setOpenDrawer}
                            />
                        )
                }
                <MoreButton
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    total={total}
                />
            </Box>
        </Box>
    );
};
export default FindNearbyPlaces;
