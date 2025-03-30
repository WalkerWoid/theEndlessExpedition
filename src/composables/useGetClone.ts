import {toRaw} from "vue";

export const useGetClone = (objToClone: object): any => {
    if (objToClone)
        return structuredClone(toRaw(objToClone))
}