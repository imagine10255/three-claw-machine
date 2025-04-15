export interface IPosition {
    x: number
    y: number
}

export interface IConfig {
    position: IPosition
}

export interface IApi {
    prizeUrl: string
    id: string
}

export type IMergeRow = IConfig & IApi;

export type TTargetIndex = 0|1|2|3|4|5|6|7
