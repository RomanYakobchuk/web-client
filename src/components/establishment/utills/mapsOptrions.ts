const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '5px'
};

const center = {
    lat: 50.27,
    lng: 30.31
};

const options = [
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#444444'
            }
        ]
    },
    {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
            {
                color: '#f2f2f2'
            }
        ]
    },
    {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
            {
                visibility: 'off'
            }
        ]
    },
    {
        featureType: 'road',
        elementType: 'all',
        stylers: [
            {
                saturation: -100
            },
            {
                lightness: 45
            }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
            {
                visibility: 'simplified'
            }
        ]
    },
    {
        featureType: 'road.arterial',
        elementType: 'labels.icon',
        stylers: [
            {
                visibility: 'off'
            }
        ]
    },
    {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
            {
                visibility: 'off'
            }
        ]
    },
    {
        featureType: 'water',
        elementType: 'all',
        stylers: [
            {
                color: '#46bcec'
            },
            {
                visibility: 'on'
            }
        ]
    }
];


export {
    center,
    options,
    containerStyle,
}