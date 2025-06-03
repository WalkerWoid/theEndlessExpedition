import type {InventoryResourceSimple} from "@/classes/player.ts";
import {useGetClone} from "@/composables/useGetClone.ts";
import type {Inventory} from "@/classes/player.ts";

export interface Effect {
    engName: string
    name: string
    chance: number
    health: number
    food: number
    water: number
    sanity: number
    ticks: number
    type: 'positive' | 'negative'
}
interface EffectType {
    [key: string]: Effect
}
interface Effects {
    [key: string]: EffectType
}
const positiveEffects: Effects = {
    heal: {
        simpleHerbalBandage: {
            engName: 'weakHeal',
            name: 'Слабое Лечение',
            chance: 100,
            health: 20,
            food: 0,
            water: 0,
            sanity: 0,
            ticks: 2,
            type: 'positive'
        },
        simpleHerbalBandage2: {
            engName: 'weakHeal2',
            name: 'Слабое Лечение2',
            chance: 100,
            health: 20,
            food: 0,
            water: 0,
            sanity: 0,
            ticks: 2,
            type: 'positive'
        },
    }
}
const negativeEffects: Effects = {
    bloodPoisoning: {
        simpleHerbalBandage: {
            engName: 'bloodPoisoning',
            name: 'Заражение крови',
            chance: 8,
            health: 0,
            food: -4,
            water: -6,
            sanity: 0,
            ticks: 40,
            type: 'negative'
        }
    },
    wormsUnderTheSkin: {
        simpleHerbalBandage: {
            engName: 'wormInfestation',
            name: 'Заражение червями',
            chance: 50,
            health: -1,
            food: -12,
            water: -20,
            sanity: -20,
            ticks: 70,
            type: 'negative'
        }
    }
}


type RecipeType = 'weapon' | 'armor' | 'medical'
export type RecipeBodyType = 'head' | 'body' | 'leftArm' | 'rightArm' | 'leftWrist' | 'rightWrist' | 'leftLeg' | 'rightLeg'
    | 'weapon' | 'shield'
export interface RecipeInfo {
    name: string,
    engName: string,
    value: number
}

export interface Recipe {
    name: string,
    engName: string,
    description: string,
    count: number,
    cost: InventoryResourceSimple[],
    type: RecipeType,
    ruType: string,
    info: RecipeInfo[],
}
export interface BattleRecipe extends Recipe {
    isEquipped: boolean
    bodyType: RecipeBodyType,
    durability: number,
}
export interface MedicalRecipe extends Recipe {
    positiveEffects: Effect[],
    negativeEffects: Effect[]
}
export type Recipes = BattleRecipe | MedicalRecipe

export interface AllRecipes {
    recipes: Recipes[]
    createRecipe(recipeToCreate: Recipes, inventory: Inventory): boolean
    isResourcesToCreateEnough(recipeToCreate: Recipes, inventory: Inventory): boolean
}

export const allRecipes: AllRecipes = {
    recipes: [
        {
            name: 'Кривая палка',
            engName: 'crookedStick',
            description: 'Ветки, наспех связанные сорванной в попыхах травой в своего большого собрата. Выглядит кривой, как культя дряхлой старухи. Бьет так же - небольно и сразу ломается. Удовольствие на один раз. Не подходит в качестве чесалки для спины, но подходит для того, что бы выколоть кому-нибудь глаз... или даже два. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным.',
            count: 1,
            cost: [
                {name: 'Трава', engName: 'grass', count: 20, type: 'resource'},
                {name: 'Ветка', engName: 'stick', count: 12, type: 'resource'}
            ],
            type: 'weapon',
            ruType: 'Оружие',
            bodyType: 'weapon',
            durability: 1,
            info: [
                {name: 'Урон', engName: 'damage', value: 3},
                {name: 'Прочность', engName: 'startedDurability', value: 1},
                {name: 'Скорость', engName: 'speed', value: 30},
                {name: 'Броня', engName: 'armor', value: -6},
            ],
            isEquipped: false
        },
        {
            name: 'Травяная панамка',
            engName: 'herbalPanamaHat',
            description: 'Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.',
            count: 1,
            cost: [
                {name: 'Трава', engName: 'grass', count: 160, type: 'resource'},
            ],
            type: 'armor',
            ruType: 'Броня',
            bodyType: 'head',
            durability: 10,
            info: [
                {name: 'Урон', engName: 'damage', value: 0},
                {name: 'Прочность', engName: 'startedDurability', value: 10},
                {name: 'Скорость', engName: 'speed', value: 0},
                {name: 'Броня', engName: 'armor', value: 1},
            ],
            isEquipped: false
        },
        {
            name: 'Простой травяной бинт',
            engName: 'simpleHerbalBandage',
            description: 'Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит - на троечку. Хороший шанс получить какое-нибудь заражение. Проще будет помочиться на рану.',
            count: 1,
            cost: [
                {name: 'Трава', engName: 'grass', count: 40, type: 'resource'},
                {name: 'Обычный цветок', engName: 'commonFlower', count: 3, type: 'resource'},
            ],
            type: 'medical',
            ruType: 'Медицина',
            info: [
                {name: 'Количество использований', engName: 'numberUses', value: 1},
            ],
            positiveEffects: [
                positiveEffects.heal.simpleHerbalBandage,
                positiveEffects.heal.simpleHerbalBandage2,
            ],
            negativeEffects: [
                negativeEffects.bloodPoisoning.simpleHerbalBandage,
                negativeEffects.wormsUnderTheSkin.simpleHerbalBandage
            ]
        },
    ],
    createRecipe(recipeToCreate, inventory): boolean {
        const itemToCreate = useGetClone(recipeToCreate) as Recipes

        if (!this.isResourcesToCreateEnough(itemToCreate, inventory)) {
            return false
        }

        itemToCreate.cost.forEach(resource => {
            inventory.decreaseResource(resource)
        })
        inventory.addItemToInventory(itemToCreate)

        console.log(inventory.playerInventory)
        return true
    },
    isResourcesToCreateEnough(itemToCreate,inventory: Inventory): boolean {
        let isResourceEnough: boolean = true

        itemToCreate.cost.forEach(resource => {
            const foundInventoryResource = inventory.getInventoryResource(resource)

            if (!foundInventoryResource) {
                isResourceEnough = false
                return
            }
            if (resource.count > foundInventoryResource.count) isResourceEnough = false
        })

        return isResourceEnough
    }
}