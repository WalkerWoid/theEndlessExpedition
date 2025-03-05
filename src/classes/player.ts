import type {Location} from "@/classes/allLocations.ts";
import type {LocationResource} from "@/classes/allLocations.ts";
import type {BattleRecipe} from "@/classes/allRecipes.ts";
import type {MedicalRecipe} from "@/classes/allRecipes.ts";
import type {RecipeBodyType} from "@/classes/allRecipes.ts";
import type {Notifications} from "@/classes/notifications.ts";
import type {RecipeInfo} from "@/classes/allRecipes.ts";

import {useIsArmorOrWeapon} from "@/composables/useIsArmorOrWeapon.ts";
import {useIsItemEquipped} from "@/composables/useIsItemEquipped.ts";
import {useGetRandomByRange} from "@/composables/useGetRandomByRange.ts";
import {useGetClone} from "@/composables/useGetClone.ts";
import {useIsItemInfoUnit} from "@/composables/useIsItemInfoUnit.ts";

type ResourceType = 'resource' | 'food' | 'placeholder'
export interface InventoryResource {
    name: string
    engName: string
    count: number | [number, number]
    type: ResourceType,
}
export interface InventoryResourceSimple extends InventoryResource {
    count: number
}
export interface InventoryResourceFood extends InventoryResource {
    count: number
    water?: number
    food?: number
}
export type InventoryItemsTypes = InventoryResourceSimple | InventoryResourceFood | BattleRecipe | MedicalRecipe

interface BodyDescription {
    [key: string]: string
}
export const bodyDescription: BodyDescription = {
    head: 'Голова',
    body: 'Тело',
    leftArm: 'Левая рука',
    rightArm: 'Правая рука',
    leftWrist: 'Левое запястье',
    rightWrist: 'Правое запястье',
    leftLeg: 'Левая нога',
    rightLeg: 'Правая нога',
    weapon: 'Оружие',
    shield: 'Щит'
}
export interface PlayerBody {
    [key: string]: BattleRecipe | boolean
    head: BattleRecipe | boolean
    body: BattleRecipe | boolean
    leftArm: BattleRecipe | boolean
    rightArm: BattleRecipe | boolean
    leftWrist: BattleRecipe | boolean
    rightWrist: BattleRecipe | boolean
    leftLeg: BattleRecipe | boolean
    rightLeg: BattleRecipe | boolean
    weapon: BattleRecipe | boolean
    shield: BattleRecipe | boolean
}
export interface Effect {
    name: string
    change: number
    health: number
    ticks: number
    food: number
    water: number
    sanity: number
}


export interface Inventory {
    playerInventory: InventoryItemsTypes[]
    farmResource(currentLocation: Location, notifications: Notifications): void
    addCockedResourceToInventory(cockedResource: InventoryResourceSimple, notifications: Notifications): void
    getInventoryResource(resource: InventoryItemsTypes): InventoryItemsTypes | undefined
    decreaseResource(resource: InventoryItemsTypes): void
    deleteFromInventory(inventoryResource: InventoryItemsTypes): void
    addItemToInventory(item: InventoryItemsTypes): void
    getItemInfoLine(item: BattleRecipe, infoType: string): RecipeInfo | undefined
}
const inventory = {
    playerInventory: [
        {
            "name": "Трава",
            "engName": "grass",
            "count": 80,
            "type": "resource"
        },
        {
            "name": "Обычный цветок",
            "engName": "commonFlower",
            "count": 6,
            "type": "resource"
        },
        {
            "name": "Травяная панамка",
            "engName": "herbalPanamaHat",
            "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
            "count": 1,
            "cost": [
                {
                    "name": "Трава",
                    "engName": "grass",
                    "count": 160,
                    "type": "resource"
                }
            ],
            "type": "armor",
            "ruType": "Броня",
            "bodyType": "head",
            "durability": 10,
            "info": [
                {
                    "name": "Урон",
                    "engName": "damage",
                    "value": 0
                },
                {
                    "name": "Прочность",
                    "engName": "startedDurability",
                    "value": 10
                },
                {
                    "name": "Скорость",
                    "engName": "speed",
                    "value": 0
                },
                {
                    "name": "Броня",
                    "engName": "armor",
                    "value": 1
                }
            ],
            "isEquipped": false
        },
        {
            "name": "Деревянный шлем",
            "engName": "woodenHelmet",
            "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
            "count": 2,
            "cost": [
                {
                    "name": "Трава",
                    "engName": "grass",
                    "count": 160,
                    "type": "resource"
                }
            ],
            "type": "armor",
            "ruType": "Броня",
            "bodyType": "head",
            "durability": 20,
            "info": [
                {
                    "name": "Урон",
                    "engName": "damage",
                    "value": 0
                },
                {
                    "name": "Прочность",
                    "engName": "startedDurability",
                    "value": 20
                },
                {
                    "name": "Скорость",
                    "engName": "speed",
                    "value": 0
                },
                {
                    "name": "Броня",
                    "engName": "armor",
                    "value": 1
                }
            ],
            "isEquipped": false
        },
        {
            "name": "Деревянный шлем",
            "engName": "woodenHelmet",
            "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
            "count": 2,
            "cost": [
                {
                    "name": "Трава",
                    "engName": "grass",
                    "count": 160,
                    "type": "resource"
                }
            ],
            "type": "armor",
            "ruType": "Броня",
            "bodyType": "head",
            "durability": 10,
            "info": [
                {
                    "name": "Урон",
                    "engName": "damage",
                    "value": 0
                },
                {
                    "name": "Прочность",
                    "engName": "startedDurability",
                    "value": 20
                },
                {
                    "name": "Скорость",
                    "engName": "speed",
                    "value": 0
                },
                {
                    "name": "Броня",
                    "engName": "armor",
                    "value": 1
                }
            ],
            "isEquipped": false
        },
        {
            "name": "Деревянный шлем",
            "engName": "woodenHelmet",
            "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
            "count": 2,
            "cost": [
                {
                    "name": "Трава",
                    "engName": "grass",
                    "count": 160,
                    "type": "resource"
                }
            ],
            "type": "armor",
            "ruType": "Броня",
            "bodyType": "head",
            "durability": 5,
            "info": [
                {
                    "name": "Урон",
                    "engName": "damage",
                    "value": 0
                },
                {
                    "name": "Прочность",
                    "engName": "startedDurability",
                    "value": 20
                },
                {
                    "name": "Скорость",
                    "engName": "speed",
                    "value": 0
                },
                {
                    "name": "Броня",
                    "engName": "armor",
                    "value": 1
                }
            ],
            "isEquipped": false
        }
    ] as InventoryItemsTypes[],
    farmResource(currentLocation: Location, notifications: Notifications) {
        const getResourceByRandomVal =
            (locationResources: LocationResource[],
             randomValForResource: number): LocationResource | undefined => {
            return locationResources.find(resource => {
                if (resource.chance)
                    return resource.chance[0] <= randomValForResource && resource.chance[1] >= randomValForResource
            })
        }
        const getCockedResource = (resource: LocationResource, count: number): InventoryResourceSimple => {
            return {
                name: resource.name,
                engName: resource.engName,
                count: count,
                type: "resource"
            }
        }

        const randomValForResource: number = useGetRandomByRange([1, 100])
        const resource = getResourceByRandomVal(currentLocation.resources, randomValForResource) ?? false

        if (!resource) {
            /*console.log('Ресурс не получен')
            console.log('Рандомное число', randomValForResource)
            console.log('Лутаем ресурс', resource)*/
            notifications.showNotification({}, 'notFarmResource')
            return false
        }

        const resourceCount = useGetRandomByRange(resource.count)
        const cockedResource = getCockedResource(resource, resourceCount)
        this.addCockedResourceToInventory(cockedResource, notifications)
        /*console.log('Рандомное число', randomValForResource)
        console.log('Лутаем ресурс', cockedResource.name)
        console.log('В количестве', resourceCount)
        console.log('Готовый ресурс', cockedResource)
        console.log('Инвертарь после фарма', this.playerInventory)*/
    },
    addCockedResourceToInventory(cockedResource: InventoryResourceSimple, notifications: Notifications) {
        let inventoryResource = this.getInventoryResource(cockedResource)
        notifications.showNotification(cockedResource, 'farmResource')

        if (!inventoryResource) {
            this.playerInventory.push(cockedResource)
            return
        }

        inventoryResource.count += Math.floor(cockedResource.count)
    },
    getInventoryResource(resource: InventoryItemsTypes): InventoryItemsTypes | undefined {
        if (useIsArmorOrWeapon(resource)) {
            return this.playerInventory.find(inventoryResource => {
                if (useIsArmorOrWeapon(inventoryResource)) {
                    return inventoryResource.engName === resource.engName
                        && inventoryResource.durability === resource.durability
                }
            })
        } else {
            return this.playerInventory.find(inventoryResource => inventoryResource.engName === resource.engName)
        }
    },
    decreaseResource(resource: InventoryItemsTypes) {
        const foundedInventoryResource = this.getInventoryResource(resource)

        if (!foundedInventoryResource) return

        foundedInventoryResource.count -= resource.count

        if (foundedInventoryResource.count <= 0) {
            this.deleteFromInventory(foundedInventoryResource)
        }
    },
    deleteFromInventory(inventoryResource: InventoryItemsTypes) {
        const itemToDelete = this.getInventoryResource(inventoryResource)
        let deletedItemIndex

        if (!itemToDelete) return

        if (useIsArmorOrWeapon(itemToDelete)) {
            deletedItemIndex =
                this.playerInventory.findIndex(item=> {
                    if (useIsArmorOrWeapon(item)) {
                        return item.engName === itemToDelete.engName
                            && item.durability === itemToDelete.durability
                    }
                })
        } else {
            deletedItemIndex =
                this.playerInventory.findIndex(item => item.engName === itemToDelete.engName)
        }

        this.playerInventory.splice(deletedItemIndex, 1)
    },
    addItemToInventory(item: InventoryItemsTypes) {
        const foundInventoryItem = this.getInventoryResource(item)

        if (foundInventoryItem)
            foundInventoryItem.count += 1
        else inventory.playerInventory.push(item)
    },
    getItemInfoLine(item: BattleRecipe, infoType: string): RecipeInfo | undefined {
        return item.info.find(infoUnit => infoUnit.engName === infoType)
    }
}


export interface Player {
    name: string
    secondName: string
    playerNumber: number
    currentLocationTitle: string
    status: string
    health: number
    maxHealth: number
    food: number
    maxFood: number
    water: number
    maxWater: number
    inventory: Inventory
    body: PlayerBody
    effects: Effect[]
    damage: number
    changeCurrentLocation(locationName: string): void
    putOnItemHandler(item: BattleRecipe, notifications: Notifications): void
    putOnItem(item: BattleRecipe, notifications: Notifications): void
    takeOffItem(itemToTakeOff: BattleRecipe, notifications: Notifications): void
    clearItemOnBody(bodyType: RecipeBodyType): void
    dismantleItem(itemToDismantle: BattleRecipe, notifications: Notifications): void
}
export const playerObj: Player = {
    name: 'Фираксис Рейнхард',
    secondName: 'Охотник',
    playerNumber: 117,
    currentLocationTitle: 'landingZone',
    status: `Осужденный по законам 19 - *Данные повреждены*; 20 - *Данные повреждены*; 21 - *Данные повреждены*;
    22 - *Данные повреждены*; 698 - Убийство особо ценного объекта, а именно: *Данные повреждены*.`,
    health: 200,
    maxHealth: 0,
    food: 0,
    maxFood: 0,
    water: 0,
    maxWater: 0,
    inventory: inventory,
    body: {
        head: false,
        body: false,
        leftArm: false,
        rightArm: false,
        leftWrist: false,
        rightWrist: false,
        leftLeg: false,
        rightLeg: false,
        weapon: false,
        shield: false
    },
    effects: [] as Effect[],
    damage: 0,
    changeCurrentLocation(locationName) {
        this.currentLocationTitle = locationName
        return 2
    },
    putOnItemHandler(item, notifications) {
        item.isEquipped = true
        const itemToEquip = useGetClone(item) as BattleRecipe
        const equippedItem = this.body[itemToEquip.bodyType]

        const isEqualItemEquipped = (itemToEqual: BattleRecipe, itemToEqualWith: BattleRecipe) => {
            return itemToEqual.engName === itemToEqualWith.engName
                && itemToEqual.durability === itemToEqualWith.durability
        }

        if (!useIsItemEquipped(equippedItem)) {
            this.putOnItem(itemToEquip, notifications)
            return
        }

        if (isEqualItemEquipped(itemToEquip, equippedItem)) {
            notifications.showNotification({}, 'equalItemEquipped')
            return
        } else {
            this.takeOffItem(equippedItem, notifications)
            this.putOnItem(itemToEquip, notifications)
        }
    },
    putOnItem(item, notifications) {
        item.count = 1
        this.body[item.bodyType] = item
        this.inventory.decreaseResource(item)
        notifications.showNotification(item, 'putOnItem')
        console.log('Инвентарь', this.inventory.playerInventory)
        console.log('Тело', this.body)
    },
    takeOffItem(itemToTakeOff, notifications) {
        const itemOnBody = this.body[itemToTakeOff.bodyType]

        if (!useIsItemEquipped(itemOnBody)) {
            notifications.showNotification({}, 'itemNotEquipped')
            return
        }
        console.log('Предмет для снятия', itemToTakeOff)
        console.log('Предмет на теле', itemOnBody)
        if ((itemToTakeOff.name !== itemOnBody.name && itemToTakeOff.durability !== itemOnBody.durability)
            || (itemToTakeOff.name !== itemOnBody.name || itemToTakeOff.durability !== itemOnBody.durability)) {
            notifications.showNotification({}, 'notEqualEquippedItem')
            return
        }

        const inventoryItem = this.inventory.getInventoryResource(itemToTakeOff)
        if (inventoryItem) {
            if (useIsArmorOrWeapon(inventoryItem)) inventoryItem.isEquipped = false
        }
        itemToTakeOff.isEquipped = false
        this.inventory.addItemToInventory(itemToTakeOff)
        this.clearItemOnBody(itemToTakeOff.bodyType)
        notifications.showNotification(itemToTakeOff, 'takeOffItem')

        console.log('Инвентарь', this.inventory.playerInventory)
        console.log('Тело', this.body)
    },
    clearItemOnBody(bodyType) {
        this.body[bodyType] = false
    },
    dismantleItem(itemToDismantle, notifications) {
        const startedDurability = this.inventory.getItemInfoLine(itemToDismantle, 'startedDurability')
        itemToDismantle.count = 1

        if (!useIsItemInfoUnit(startedDurability)) return

        if (itemToDismantle.durability === startedDurability.value) {
            itemToDismantle.cost.forEach(res => {
                this.inventory.addCockedResourceToInventory(res, notifications)
            })
        } else if (itemToDismantle.durability < startedDurability.value
            && itemToDismantle.durability >= Math.floor(startedDurability.value / 2)) {

            itemToDismantle.cost.forEach(res => {
                res.count = Math.floor(res.count / 2)
                this.inventory.addCockedResourceToInventory(res, notifications)
            })
        } else {
            itemToDismantle.cost.forEach(res => {
                res.count = Math.floor(res.count / 4)
                this.inventory.addCockedResourceToInventory(res, notifications)
            })
        }

        this.inventory.decreaseResource(itemToDismantle)
    }
}
