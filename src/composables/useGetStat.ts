import type {Player} from "@/classes/player.ts";
import type {Enemy} from "@/types/battle/types";

type Actor = Player | Enemy | undefined
type StatType = 'health' | 'maxHealth' | 'armor' | 'maxArmor' | 'speed' | 'maxSpeed' | 'damage' | 'maxDamage'
export const useGetStat = (actor: Actor, statType: StatType) => {
    return actor ? actor[statType] : 0
}