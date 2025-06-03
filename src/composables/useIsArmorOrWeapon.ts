import type {InventoryItemsTypes} from "@/classes/player.ts";
import type {BattleRecipe} from "@/classes/allRecipes.ts";
export const useIsArmorOrWeapon = (resource: InventoryItemsTypes | boolean): resource is BattleRecipe => {
    return typeof resource === 'object' && (resource.type === 'weapon' || resource.type === 'armor')
}