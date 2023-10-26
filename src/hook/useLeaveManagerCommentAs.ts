import {
    CommentCreatorDataContext,
    TPropsCommentCreatorContext,
    TSelectOption
} from "../contexts/CommentCreatorDataContext";
import {useContext} from "react";

type TProps = {
    selectedInfo: TSelectOption,
    // setSelectedInfo: Dispatch<SetStateAction<TProps['selectedInfo']>>
    setSelectedInfo: (value: TSelectOption) => void,
    managerRole: "user" | "establishment",
    // setManagerRole: Dispatch<SetStateAction<TProps['managerRole']>>
    setManagerRole: (value: TPropsCommentCreatorContext['managerRole']) => void,
}
export const useLeaveManagerCommentAs = (): TProps => {
    const {setManagerRole, managerRole, setSelectedInfo, selectedInfo} = useContext(CommentCreatorDataContext);

    return {
        selectedInfo,
        setSelectedInfo,
        managerRole,
        setManagerRole
    }
}