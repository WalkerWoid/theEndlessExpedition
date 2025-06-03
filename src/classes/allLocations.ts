import type {InventoryResource} from "@/classes/player.ts";
import type {Enemies} from "@/types/battle/types";

export interface LocationResource extends InventoryResource {
    chance: [number, number],
    count: [number, number]
}

type SubmenuUnitTitle =
    'i'     | 'задания'   | 'ресурсы' |
    'охота' | 'контракты' | 'карта'   |
    'ритуалы'
type SubmenuUnitId =
    'info' | 'locationQuests' | 'resources' |
    'hunt' | 'contracts'      | 'map'       |
    'rituals'
interface SubmenuUnit {
    title: SubmenuUnitTitle,
    id: SubmenuUnitId
}

export interface Location {
    id: number
    name: string
    accusativeSingular: string
    engName: string
    coords: [number, number]
    width: number
    height: number
    resources: LocationResource[]
    subMenu: SubmenuUnit[]
    isCurrent: boolean
    npc: string[]
    enemies: Enemies
}


export const allLocations: Location[] = [
    {
        id: 0,
        name: 'Зона посадки',
        accusativeSingular: 'Зону посадки',
        engName: 'landingZone',
        coords: [15, 55],
        width: 135,
        height: 140,
        resources: [
            {chance: [1, 60], name: 'Трава', engName: 'grass', count: [10, 20], type: 'resource'},
            {chance: [61, 80], name: 'Ветка', engName: 'stick', count: [6, 10], type: 'resource'},
            {chance: [81, 99], name: 'Обычный цветок', engName: 'commonFlower', count: [3, 7], type: 'resource'},
            {chance: [100, 100], name: 'Златограйник', engName: 'goldenFlower', count: [1, 1], type: 'resource'}
        ],
        subMenu: [
            {title: 'i', id: 'info'},
            {title: 'задания', id: 'locationQuests'},
            {title: 'ресурсы', id: 'resources'},
            {title: 'охота', id: 'hunt'},
            {title: 'контракты', id: 'contracts'},
            {title: 'карта', id: 'map'},
            {title: 'ритуалы', id: 'rituals'}
        ],
        isCurrent: true,
        npc: ['satyr'],
        // enemies: ['Маленький слайм', 'Живой камушек', 'Цветочная птица', 'Черный скорпион'],
        enemies: [
            // {
            //     id: 0,
            //     name: 'Маленький слайм',
            //     accusativeSingular: 'Маленького слайма',
            //     description: `Просто маленький слайм.`,
            //     type: "enemy",
            //     health: 10,
            //     maxHealth: 10,
            //     damage: 2,
            //     maxDamage: 2,
            //     armor: 1,
            //     maxArmor: 1,
            //     speed: 10,
            //     maxSpeed: 10,
            //     // chance: [31, 60],
            //     chance: [1, 100],
            // },
            {
                id: 1,
                name: 'Злойм-слайм',
                accusativeSingular: 'Злойм-слайма',
                description: `Злойм-слайм. Злойм-слайм - старший брат маленького слайма. Не дай
                Принцесса-Освободительница вам столкнуться с ним.`,
                type: "enemy",
                health: 50,
                maxHealth: 50,
                damage: 10,
                maxDamage: 10,
                armor: 6,
                maxArmor: 6,
                // speed: 20,
                speed: 9,
                maxSpeed: 9,
                // maxSpeed: 20,
                // chance: [91, 100],
                chance: [1, 100],
            }
        ]
    },
    {
        id: 1,
        name: 'Тестовая зона1',
        accusativeSingular: 'Тестовую зону1',
        engName: 'testZone1',
        coords: [200, 200],
        width: 135,
        height: 140,
        resources: [
            {chance: [100, 100], name: 'Златограйник', engName: 'goldenFlower', count: [1, 1], type: 'resource'}
        ],
        subMenu: [
            {title: 'i', id: 'info'},
            {title: 'ресурсы', id: 'resources'}
        ],
        isCurrent: false,
        npc: ['logbook'],
        enemies: [
            {
                id: 2,
                name: 'Лесной дух',
                accusativeSingular: 'Лесного духа',
                description: `Лесной дух, который водится в чаще, наводит шороху на ее обитателей. Но кто же знал, что
                лесным духом окажется маленькая и проворная фея?`,
                type: "enemy",
                health: 20,
                maxHealth: 20,
                damage: 6,
                maxDamage: 6,
                armor: 3,
                maxArmor: 3,
                speed: 20,
                maxSpeed: 20,
                chance: [1, 10],
            }
        ]
    }
]
export const locationPlaceholder: Location = {
    id: -1,
    name: 'Локация заглушка',
    accusativeSingular: 'Локацию заглушку',
    engName: 'locationPlaceholder',
    coords: [200, 200],
    width: 135,
    height: 140,
    resources: [],
    subMenu: [],
    isCurrent: false,
    npc: [],
    enemies: []
}