
export const getAssetPath = (path: string) => {
    if (!path) return '';
    // If it's an external URL (http/https), return as is
    if (path.startsWith('http')) {
        // Special case for local uploads during dev
        if (path.includes('localhost:5001/uploads')) {
            const fileName = path.split('/').pop();
            return `${import.meta.env.BASE_URL}uploads/${fileName}`;
        }
        return path;
    }

    // Ensure path starts with a slash if it doesn't
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // import.meta.env.BASE_URL is '/' in local dev and '/app-language-center/' in production
    const base = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL.slice(0, -1)
        : import.meta.env.BASE_URL;

    return `${base}${normalizedPath}`;
};
