
export function getGitHubUrl(from: string, type: string) {
    const rootURL = `${process.env.REACT_APP_GITHUB_OAUTH_ROOT_URL}`;

    const options = {
        client_id: process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID as string,
        redirect_uri: `${process.env.REACT_APP_API as string}/api/v1/auth/${type}`,
        scope: ['read:user', 'user:email'].join(' '),
        state: from
    };

    const qs = new URLSearchParams(options);

    return `${rootURL}?${qs.toString()}`;
}
