import type {Enemy} from "@/types/battle/types";


export const useIsEnemy = (unit: any): unit is Enemy => {
    return typeof unit === 'object' && 'type' in unit
}