import type {InventoryResourceSimple} from "@/classes/player.ts";
import {useGetClone} from "@/composables/useGetClone.ts";
import type {Inventory} from "@/classes/player.ts";

interface Effect {
    name: string
    chance: number
    health: number
    food: number
    water: number
    sanity: number
    ticks: number
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
            name: 'Слабое Лечение',
            chance: 100,
            health: 20,
            food: 0,
            water: 0,
            sanity: 0,
            ticks: 2
        }
    }
}
const negativeEffects: Effects = {
    bloodPoisoning: {
        simpleHerbalBandage: {
            name: 'Заражение крови',
            chance: 8,
            health: 0,
            food: -4,
            water: -6,
            sanity: 0,
            ticks: 40
        }
    },
    wormsUnderTheSkin: {
        simpleHerbalBandage: {
            name: 'Заражение червями',
            chance: 50,
            health: -1,
            food: -12,
            water: -20,
            sanity: -20,
            ticks: 70
        }
    }
}


type RecipeType = 'weapon' | 'armor' | 'medical'
type RecipeBodyType = 'head' | 'body' | 'leftArm' | 'rightArm' | 'leftWrist' | 'rightWrist' | 'leftLeg' | 'rightLeg'
    | 'weapon' | 'shield'
interface RecipeInfo {
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
    createRecipe(recipeToCreate: Recipes, inventory: Inventory): any
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
                positiveEffects.heal.simpleHerbalBandage
            ],
            negativeEffects: [
                negativeEffects.bloodPoisoning.simpleHerbalBandage,
                negativeEffects.wormsUnderTheSkin.simpleHerbalBandage
            ]
        },
    ],
    createRecipe(recipeToCreate, inventory): any {
        console.log('Рецепт для создания:', recipeToCreate)
        const itemToCreate = useGetClone(recipeToCreate) as Recipes

        if (!this.isResourcesToCreateEnough(itemToCreate, inventory)) {
            console.log('Недостаточно ресов')
            return
        }

        console.log('Достаточно ресов')
        itemToCreate.cost.forEach(resource => {
            inventory.decreaseResource(resource)
        })
        inventory.addItemToInventory(itemToCreate)

        console.log('Инвентарь', inventory.playerInventory)
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