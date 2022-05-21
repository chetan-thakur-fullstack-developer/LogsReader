export interface IResponse {
    filename: string,
    losg_id: string,
    tally: IData[]
}
export interface IData { 
    email: string,
    total: number
}