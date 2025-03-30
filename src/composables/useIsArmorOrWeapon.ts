import type {InventoryItemsTypes} from "@/classes/player.ts";
import type {BattleRecipe} from "@/classes/allRecipes.ts";
export const useIsArmorOrWeapon = (resource: InventoryItemsTypes): resource is BattleRecipe => {
    return resource.type === 'weapon' || resource.type === 'armor'
}