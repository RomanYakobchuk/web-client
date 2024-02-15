
export function getGitHubUrl(from: string, type: string) {
    const rootURL = `${import.meta.env.VITE_APP_GITHUB_OAUTH_ROOT_URL}`;

    const options = {
        client_id: import.meta.env.VITE_APP_GITHUB_OAUTH_CLIENT_ID as string,
        redirect_uri: `${import.meta.env.VITE_APP_API as string}/api/v1/auth/${type}`,
        scope: ['read:user', 'user:email'].join(' '),
        state: from
    };

    const qs = new URLSearchParams(options);

    return `${rootURL}?${qs.toString()}`;
}
