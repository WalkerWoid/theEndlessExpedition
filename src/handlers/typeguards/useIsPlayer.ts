import type {Player} from "@/classes/player.ts";

export const useIsPlayer = (player: any): player is Player => {
    return typeof player === 'object' && 'playerNumber' in player
}