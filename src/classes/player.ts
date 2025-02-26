import type {Location} from "@/classes/allLocations.ts";
import type {LocationResource} from "@/classes/allLocations.ts";
import {useGetRandomByRange} from "@/composables/useGetRandomByRange.ts";

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
interface InventoryResourceFood extends InventoryResource {
    count: number
    water?: number
    food?: number
}
export type InventoryItemsTypes = InventoryResourceSimple | InventoryResourceFood


interface PlayerBody {
    head: boolean
    body: boolean
    leftArm: boolean
    rightArm: boolean
    leftWrist: boolean
    rightWrist: boolean
    leftLeg: boolean
    rightLeg: boolean
    weapon: boolean
    shield: boolean
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
    farmResource(currentLocation: Location): InventoryResourceSimple | boolean
    addCockedResourceToInventory(cockedResource: InventoryResourceSimple): void
    getInventoryResource(resource: InventoryItemsTypes): InventoryItemsTypes | undefined
}
const inventory = {
    playerInventory: [] as InventoryItemsTypes[],
    farmResource(currentLocation: Location) {
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
            return false
        }

        const resourceCount = useGetRandomByRange(resource.count)
        const cockedResource = getCockedResource(resource, resourceCount)
        this.addCockedResourceToInventory(cockedResource)

        /*console.log('Рандомное число', randomValForResource)
        console.log('Лутаем ресурс', cockedResource.name)
        console.log('В количестве', resourceCount)
        console.log('Готовый ресурс', cockedResource)
        console.log('Инвертарь после фарма', this.playerInventory)*/

        return cockedResource
    },
    addCockedResourceToInventory(cockedResource: InventoryResourceSimple) {
        let inventoryResource = this.getInventoryResource(cockedResource)
        if (!inventoryResource) {
            this.playerInventory.push(cockedResource)
            return
        }

        inventoryResource.count += Math.floor(cockedResource.count)
    },
    getInventoryResource(resource: InventoryItemsTypes): InventoryItemsTypes | undefined {
        return this.playerInventory.find(inventoryResource => inventoryResource.engName === resource.engName)
    }
}


export interface Player {
    name: string
    secondName: string
    number: number
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
}
export const playerObj: Player = {
    name: 'Фираксис Рейнхард',
    secondName: 'Охотник',
    number: 117,
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
    changeCurrentLocation(locationName: string) {
        this.currentLocationTitle = locationName
    }
}
