export interface IArray {
    name: string,
    value: string
}

export interface IErrorResp {
    type: string,
    message: any
}

export interface IPageInfo {
    page: number,
    totalPages: number,
    totalRecords: number
}