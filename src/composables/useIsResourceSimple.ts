import type {InventoryResourceSimple} from "@/classes/player.ts";
import type {InventoryItemsTypes} from "@/classes/player.ts";

export const useIsResourceSimple = (resource: InventoryItemsTypes): resource is InventoryResourceSimple => {
    return resource.type === 'resource'
}