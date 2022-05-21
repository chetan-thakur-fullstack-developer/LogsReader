export interface ILogsData { 
    id: string,
    logs: ILogData[],
}
export interface ILogData { 
    email: string;
    id: string;
    message: string;
}