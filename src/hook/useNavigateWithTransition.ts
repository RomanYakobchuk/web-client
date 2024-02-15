import {flushSync} from "react-dom";
import {useNavigate} from "react-router-dom";

type TProps = (link: string) => void;
export const useNavigateWithTransition = (): TProps => {

    const navigate = useNavigate();
    return (link: string) => {
        if (!document.startViewTransition) {
            navigate(link)
        } else {
            document.startViewTransition(() => {
                flushSync(() => {
                    navigate(link)
                })
            })
        }
    };
}