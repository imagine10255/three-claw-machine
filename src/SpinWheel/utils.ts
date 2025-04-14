import {IApi, IMergeRow} from './types.ts';
import {config} from './config.ts';


export function mergeArrays(arr: IApi[]): IMergeRow[] {
    if (config.length !== arr.length) {
        throw new Error('陣列長度必須為 8');
    }

    const mergedArray: IMergeRow[] = [];

    for (let i = 0; i < arr.length; i++) {
        const mergedObject = {
            position: config[i].position,
            prizeUrl: arr[i].prizeUrl,
            id:arr[i].id,
        };
        mergedArray.push(mergedObject);
    }

    return mergedArray;
}
