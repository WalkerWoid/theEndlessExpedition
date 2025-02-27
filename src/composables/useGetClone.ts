import {toRaw} from "vue";

export const useGetClone = (objToClone: object) => {
    if (objToClone)
        return structuredClone(toRaw(objToClone))
}