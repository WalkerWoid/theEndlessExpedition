import type {MedicalRecipe} from "@/classes/allRecipes.ts";
import type {InventoryItemsTypes} from "@/classes/player.ts";

export const useIsMedical = (item: InventoryItemsTypes): item is MedicalRecipe => {
    return typeof item === 'object' && item.type === 'medical'
}