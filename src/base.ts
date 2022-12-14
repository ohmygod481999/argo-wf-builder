function baseUrl(): string {
    return  '/';
}

export function uiUrl(uiPath: string): string {
    return baseUrl() + uiPath;
}

export function uiUrlWithParams(uiPath: string, params: string[]): string {
    if (!params) {
        return uiUrl(uiPath);
    }
    return baseUrl() + uiPath + '?' + params.join('&');
}

export function apiUrl(apiPath: string): string {
    return `${baseUrl()}${apiPath}`;
}
