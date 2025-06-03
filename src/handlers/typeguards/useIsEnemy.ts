import type {Enemy} from "@/types/battle/types";
export const useIsEnemy = (actor: any): actor is Enemy => {
    return typeof actor === 'object' && 'type' in actor
}