import {AxiosResponse} from "axios";

const getAxiosResponse = <TResult>(data: TResult) => ({data, status: 200, statusText: "", config: {}, headers: {}})

export const mockApiResolvedValue = <TResult>(method: jest.MockedFunctionDeep<(...args: any[]) => Promise<AxiosResponse<TResult>>>, data: TResult) => {
    return method.mockResolvedValue(getAxiosResponse(data))
}

export const mockApiResolvedValueOnce = <TResult>(method: jest.MockedFunctionDeep<(...args: any[]) => Promise<AxiosResponse<TResult>>>, data: TResult) => {
    return method.mockResolvedValueOnce(getAxiosResponse(data))
}