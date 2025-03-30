import type {RecipeInfo} from "@/classes/allRecipes.ts";

export const useIsItemInfoUnit = (infoUnit: RecipeInfo | undefined): infoUnit is RecipeInfo => {
    return typeof infoUnit === 'object' && 'value' in infoUnit
}