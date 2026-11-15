export const apiUrl = (path: string, base: string): string => `${base}${path}`;

export const graphqlUrl = (base: string): string => apiUrl('/graphql', base);
