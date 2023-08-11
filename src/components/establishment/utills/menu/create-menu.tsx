import {axiosInstance} from "../../../../authProvider";
import {ChangeEvent, useState} from "react";
import {useParams} from "react-router-dom";

const CreateMenu = () => {
    const {id} = useParams();
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('menu', selectedFile);

        try {
            const response = await axiosInstance.post(`/menu/create/${id}`, formData);

            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileSelect} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
export default CreateMenu
