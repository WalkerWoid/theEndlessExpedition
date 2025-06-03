import {watch} from "vue";

import type {Player} from "@/classes/player.ts";
import type {Effect} from "@/classes/allRecipes.ts";
import type {Enemies, Enemy} from "@/types/battle/types";

import {useGetRandomByRange} from "@/composables/useGetRandomByRange.ts";

export interface TimeObjectInterface {
    day: number | string
    hour: number | string
    minute: number | string
}
export interface GameInterface {
    day: number
    hour: number
    minute: number
    iteration: number

    gameInit(player: Player): void
    timeInit(player: Player): void
    changeTime(minute: number, hour: number, day: number): void
    getTime(typeOfTime: 'day' | 'hour' | 'minute'): number | string
    watchPlayerCharacteristics(player: Player): void

    getEnemy(enemies: Enemies): Enemy | undefined
}
export const theGame: GameInterface = {
    day: 0,
    hour: 23,
    minute: 58,
    iteration: 0,

    gameInit(player) {
        this.timeInit(player)
        player.playerInit()
    },
    timeInit(player) {
        watch(
            [() => this.day, () => this.hour, () => this.minute],
            ([newDay, newHour, newMinute],
                 [oldDay, oldHour, oldMinute]) => {
                let extraHours = 0;
                let extraDays = 0;

                // Корректируем минуты (если больше 60, превращаем в часы)
                if (newMinute >= 60) {
                    extraHours = Math.floor(newMinute / 60);
                    this.minute = newMinute % 60;
                }

                // Корректируем часы (если больше 24, превращаем в дни)
                if (newHour + extraHours >= 24) {
                    extraDays = Math.floor((newHour + extraHours) / 24);
                    this.hour = (newHour + extraHours) % 24;
                } else {
                    this.hour = newHour + extraHours;
                }

                // Вызываем функцию для обновления дней
                if (extraHours > 0 || extraDays > 0) {
                    this.changeTime(0, 0, extraDays);
                }
            }
        )
        watch(() => this.hour, (newHour) => {
            let effectsToClear: Effect[]  = []
            effectsToClear = player.calcEffects()

            if (effectsToClear.length !== 0) {
                player.clearEffects(effectsToClear)
            }
            this.watchPlayerCharacteristics(player)
        })
    },
    changeTime(minute = 0, hour = 0, day = 0) {
        this.minute += minute
        this.hour += hour
        this.day += day
    },
    getTime(typeOfTime) {
        if (this[typeOfTime].toString().length === 1) {
            return `0${this[typeOfTime]}`
        } else {
            return this[typeOfTime]
        }
    },
    watchPlayerCharacteristics(player) {
        player.changeMainCharacteristic('water', -4)
        player.changeMainCharacteristic('food', -5)

        if (player.getCurrentWater() <= 0) {
            player.changeMainCharacteristic('health', -10)
        }
        if (player.getCurrentFood() <= 0) {
            player.changeMainCharacteristic('health',-3)
        }
        // if (player.getCurrentHealth() <= 0) {
        //     this.iteration += 1
        //     console.log('Персонаж погиб, сбрасываем его', this.iteration)
        //     /* сбрасываем настройки игры */
        // }
    },

    getEnemy(enemies) {
        const randomValForEnemy = useGetRandomByRange([1, 100])
        console.log('Рандомное число для врага', randomValForEnemy)

        return enemies.find(enemy => {
            return randomValForEnemy >= enemy.chance[0] && randomValForEnemy <= enemy.chance[1]
        })
    }
}
/*
  todo у каждого противника будет полоска агрессивности, в заивимости от неебудет увеличиваться скорость и атака. Пока
    не реализовано
  todo от полоски адреналина, которая будет увеличиваться по мере уменьшения здоровья, будут использоваться все более
    опасные атаки.
  todo я же хотел сделать так, что будет описание приготовления врага, но игрок не будет знать, что враг будет делать.
    У игрока будут несколько выборов типа атаковать или стоять на месте
*/