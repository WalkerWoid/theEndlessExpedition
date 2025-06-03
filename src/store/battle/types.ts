import type {Ref} from "vue";

import type {Enemy} from "@/types/battle/types";

import type {Player} from "@/classes/player.ts";
import type {PlayerActions} from "@/types/battle/types";


export interface BattleStoreInterface {
    activeEnemy: Ref<Enemy | undefined>
    turnNumber: Ref<number>
    turnOwner: Ref<Enemy | Player | undefined>
    playerAction: Ref<PlayerActions>
    nextTurnOwnerMessage: Ref<string>
    battleLog: Ref<BattleLogInterface[]>
    nextTurn(): void
    startBattle(player: Player): void
}
export interface BattleLogInterface {
    id: number
    text: string
}