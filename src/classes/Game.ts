import type {Player} from "@/classes/player.ts";
import {watch} from "vue";

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
}
export const theGame: GameInterface = {
    day: 0,
    hour: 23,
    minute: 50,
    iteration: 0,

    gameInit(player) {
        this.timeInit(player)
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
            player.calcEffects()
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

        if (player.getCurrentWater() === 0) {
            player.changeMainCharacteristic('health', -10)
        }
        if (player.getCurrentFood() === 0) {
            player.changeMainCharacteristic('health',-3)
        }
        if (player.getCurrentHealth() === 0) {
            this.iteration += 1
            console.log('Персонаж погиб, сбрасываем его', this.iteration)
            /* сбрасываем настройки игры */
        }
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