export const ROUTE_PATHS = {
    AUTH: {
        ROOT: "/",
        SIGNUP: "/auth/signup",
        LOGIN: "/auth/login",
        REFRESH_TOKEN: "/auth/refresh-token",
        LOGOUT: "/auth/logout"
    },
    POST: {
        ROOT: "/posts",
        CREATE: "/posts",
        PUBLISHED: "/posts/published",
        GET_BY_AUTHOR: "/posts/author/:authorId",
        GET_BY_ID: "/posts/:id",
        UPDATE: "/posts/:id",
        DELETE: "/posts/:id",
    },
}