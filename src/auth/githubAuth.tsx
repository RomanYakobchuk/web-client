import { useLocation, Link } from "react-router-dom";
import {getGitHubUrl} from "./githubSettings";
import {GitHub} from "@mui/icons-material";

type IProps = {
    text?: "signin_with" | "signup_with" | "continue_with" | undefined,
    type: "login_github" | "register_github"
}
const GithubAuth = ({type}: IProps) => {
    const location = useLocation();
    let from = ((location.state as any)?.from?.pathname as string) || '/';

    return (
        <Link
            preventScrollReset
            to={getGitHubUrl(from, type)}
            style={{
                backgroundColor: '#f5f6f7',
                borderRadius: 1,
                paddingTop: '0.6rem',
                paddingBottom: '0.6rem',
                marginTop: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                columnGap: '1rem',
                textDecoration: 'none',
                color: '#393e45',
                cursor: 'pointer',
                fontWeight: 500,
                // '&:hover': {
                //     backgroundColor: '#fff',
                //     boxShadow: '0 1px 13px 0 rgb(0 0 0 / 15%)',
                // },
            }}
        >
            <GitHub/>
            GitHub
        </Link>
    );
};
export default GithubAuth;
