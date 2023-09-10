import {useState} from "react";


interface CityProps {
    uk: string,
    en: string,
    photo: any,
}
const UpdateCity = () => {

    const [oneCity, setOneCity] = useState<CityProps>()

    return (
        <div>
            UpdateCity
        </div>
    );
};
export default UpdateCity
