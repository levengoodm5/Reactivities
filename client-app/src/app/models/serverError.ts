export interface ServerError {
    statusCode: number;
    message: string | undefined;
    details: string | undefined;
}