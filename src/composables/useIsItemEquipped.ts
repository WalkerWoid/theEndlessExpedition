import type {BattleRecipe} from "@/classes/allRecipes.ts";

export const useIsItemEquipped = (bodyPart: BattleRecipe | boolean): bodyPart is BattleRecipe => {
    return typeof bodyPart === 'object' && 'name' in bodyPart && 'durability' in bodyPart
}