import type {InventoryResource} from "@/classes/player.ts";
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
    enemies: string[]
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
        npc: ['logbook'],
        enemies: ['littleSlime', 'littleLivingStone', 'flowerBird', 'blackScorpion']
    },
    {
        id: 1,
        name: 'Тестовая зона1',
        accusativeSingular: 'Тестовую зону1',
        engName: 'landingZone2',
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
        npc: ['satyr'],
        enemies: ['woodenElf']
    }
]