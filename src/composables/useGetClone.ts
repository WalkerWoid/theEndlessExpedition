import {toRaw} from "vue";

export const useGetClone = (objToClone: any): any => {
    if (objToClone)
        return structuredClone(toRaw(objToClone))
}