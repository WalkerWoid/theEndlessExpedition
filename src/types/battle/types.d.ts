import {Player} from "@/classes/player.ts";

export interface Enemy {
    id: number
    name: string
    accusativeSingular: string
    description: string
    type: 'enemy'
    health: number
    maxHealth: number
    damage: number
    maxDamage: number
    armor: number
    maxArmor: number
    speed: number
    maxSpeed: number
    chance: [number, number]
    loot?: string[]
    aggressiveness?: number
    maxAggressiveness?: number
    aggressivenessRate?: number
    adrenaline?: number
    maxAdrenaline?: number
    buffs?: string[]
    attacks?: string[]
}
export type Enemies = Enemy[]
export type PlayerActions = 'attack' | 'defence' | 'avoidance' | 'magicBook'
export type Actor = Player | Enemy | undefined
export type StatType = 'health' | 'armor' | 'speed' | 'damage'
export type MaxStatType = 'maxHealth' | 'maxArmor' | 'maxSpeed' | 'maxDamage'
