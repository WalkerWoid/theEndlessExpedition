/*
    *   todo Защита: Будет работать так. Каждыая единица защиты - тысячный процент уменьшения урона.
    *    То есть... Короче блять понятно.
    *   todo Скорость: У кого больше скорость, тот и ходит. Будет высчитываться перед боем. Расчитываться будет так:
    *    Если, например, у меня скорость 7, а у врага - 10, то враг ходит первый. Расчет скорости выглядит так:
    *    7 - 10 = -3. Если отричательная - враг ходит первый, если положительная, хожу я. Эта -3, получается, уходит в
    *    некст расчет в сторону врага: 7(моя скорость) - (10(враг) + 3(пул врага)) = -6. Враг быстрее на 6 пунктов.
    *    Если эти 6 будет больше моей скорости, враг ходит второй раз, а пул его скорости будет 8(или сколько там у
    *    него накопилось) - 7 = 1. И так далее.
    *   todo Уклонение, Атака и Защита: Стойка Атаки - наносит на 10 процентов больше урона, но уменьшает защиту на
    *    20 процентов. Защита - увеличивает защиту на 10 процентов, но уменьшает атаку на 20 процентов. Уклонение - дает
    *    единственный шанс уклониться. Он равен 15 процентам. Как введу умения, цифры можно увеличивать.
    *   todo Агрессия врага повышает его атаку в коэффициенте. Будет задаваться коэффициент агрессии для каждого врага.
    *    То есть, если текущая агрессия = 1, то атака повышается на 1*коэфф. И так до макс агрессии. Агрессивность
    *    начнет повышаться после третьего хода на коэффициент каждый ход.
    *   todo Адреналин: повышает скорость и защиту на указанный коэффициент, равный единице потерянного здоровья,
    *    умноженного на коэффициент. Повышение идет сразу же, как только теряется здоровье.
    * */

import {defineStore} from "pinia"
import {onWatcherCleanup, ref, toRaw, toValue, unref, watch} from "vue";

import type {BattleStoreInterface} from "@/store/battle/types.ts";
import type {Player} from "@/classes/player.ts";
import type {Enemy} from "@/types/battle/types";
import type {PlayerActions} from "@/types/battle/types";
import type {BattleLogInterface} from "@/store/battle/types.ts";

import {useIsPlayer} from "@/handlers/typeguards/useIsPlayer.ts";
import {useIsEnemy} from "@/handlers/typeguards/useIsEnemy.ts";

export const useBattleStore = defineStore('battleStore', () => {
    const activeEnemy = ref<Enemy | undefined>(undefined)
    const turnNumber = ref<number>(1)
    const turnOwner = ref<Player | Enemy | undefined>(undefined)
    const player = ref<Player | undefined>(undefined)
    const playerAction = ref<PlayerActions>("defence")
    const playerAvoidanceChange = ref<number>(0)
    const nextTurnOwnerMessage = ref<string>('Ваш/вражеский ход')
    const nextMessage = ref<string>('')
    const battleLog = ref<BattleLogInterface[]>([])
    const speedPool = ref<number>(0)

    /**
     * todo заблочить выбор экшена для следующего хода до нашего хода. А то можно менять стойки при вражеском ходе. Или
     *  оставить как фичу? */

    watch(
        () => turnNumber.value,
        (nextNumber) => {
            if (useIsPlayer(turnOwner.value))
                nextTurnOwnerMessage.value = 'Ваш ход'
            else nextTurnOwnerMessage.value = 'Вражеский ход'
        })
    watch(
        () => [playerAction.value, player.value],
        ([newAction, newPlayer]) => {
            if (!useIsPlayer(player.value)) return

            switch (newAction) {
                case "attack":
                    player.value.damage = Math.round(player.value.damage * 1.1)
                    player.value.armor = Math.round(player.value.armor * 0.8)
                    break
                case "defence":
                    player.value.damage = Math.round(player.value.damage * 0.8)
                    player.value.armor = Math.round(player.value.armor * 1.1)
                    break
                case "avoidance":
                    playerAvoidanceChange.value = 20
                    break
            }

            onWatcherCleanup(() => {
                if (!useIsPlayer(player.value)) return

                player.value.damage = player.value.maxDamage
                player.value.armor = player.value.maxArmor
                playerAvoidanceChange.value = 0
            })
    })


    const setPlayer = (playerProp: Player) => {
        player.value = playerProp
        // console.log('сетим игрока')
    }
    const changeTurnOwner = (newOwner: Player | Enemy) => {
        // console.log('Меняем ход на ', newOwner)
        turnOwner.value = newOwner
    }
    function fillBattleLog(newText: string) {
        let newId = 0
        battleLog.value.forEach(battleText => {
            if (newId === battleText.id) newId++
        })
        console.log(turnNumber.value)
        battleLog.value.push({id: newId, text: `Ход: ${turnNumber.value}: ${newText}`})
    }
    const initSpeedComparison = () => {
        // console.log('Инициализация скорости')

        if (!useIsPlayer(player.value)) return
        if (!useIsEnemy(activeEnemy.value)) return

        speedPool.value = player.value.speed - activeEnemy.value.speed
        // console.log('Пул скорости: ', speedPool.value)

        if (speedPool.value > 0) {
            changeTurnOwner(player.value)
            nextTurnOwnerMessage.value = 'Ваш ход'
            fillBattleLog('Битва начинается! Вы ходите...')
        }
        else {
            changeTurnOwner(activeEnemy.value)
            nextTurnOwnerMessage.value = 'Вражеский ход'
            fillBattleLog('Битва начинается! Враг ходит...')
        }

        // console.log('Сейчас ходит', turnOwner.value.name)
    }
    const startBattle = (playerProp: Player) => {
        setPlayer(playerProp)
        initSpeedComparison()
    }


    const toggleTurn = () => {
        turnNumber.value += 1
    }
    /**
     * todo Вроде пока работает. Но нормально вывести консоль логи с пулом скорости. А то я чет не понимаю, как она
     *  считается. Пересчитаю, когда буду переносить все и рефачить код.
     */
    /**
    * todo С баттлогом тож такая ж фигня, как и была с ходами. Тип отображается в батл логе прошлый ход. Если ход передается
    *   врагу, текст урона не мой, а его.
    * */
    /**
     * todo Сделать детальный вывод текста. СДелать так, что бы был ход, но при нажатии на сам ход, происходил экспанд
     *  текст с дополнительной информацией:
     *      Ваш ход(можно нажать и раскроется список с тем, сколько урона нанес враг, сколько я заблочил и так далее.)*/
    function calculateSpeed() {
        // console.clear()
        if (!useIsPlayer(player.value)) return
        if (!useIsEnemy(activeEnemy.value)) return

        // console.log('Происходит подсчет скорости')
        // console.log('Ходил ', turnOwner.value.name)
        // console.log('Пул скорости', speedPool.value)

        if (speedPool.value > 0) {
            // console.log(
            //     `Целая часть от деления по модулю: ${speedPool.value}/${activeEnemy.value.speed}`,
            //     Math.abs(Math.trunc(speedPool.value / activeEnemy.value.speed))
            // )
            if (Math.abs(Math.trunc(speedPool.value / activeEnemy.value.speed)) >= 1) {
                // console.log('Мы быстрее. Передаем ход игроку еще раз')
                changeTurnOwner(player.value)
                speedPool.value -= activeEnemy.value.speed
                fillBattleLog('Вы быстрее. Ваш ход!')
                // console.log('После хода игрока новый пул скорости будет: ', speedPool.value)
            } else {
                if (useIsEnemy(turnOwner.value)) {
                    // console.log('Прошлый ход был ходом врага. Передаем ход игроку.')
                    changeTurnOwner(player.value)
                    fillBattleLog('Вы ходите...')
                    // console.log('После хода игрока новый пул скорости будет: ', player.value.speed - activeEnemy.value.speed + speedPool.value)
                } else  {
                    // console.log('Передаем ход врагу')
                    changeTurnOwner(activeEnemy.value)
                    fillBattleLog('Ход передан врагу...')
                    // console.log('После хода врага новый пул скорости будет: ', player.value.speed - activeEnemy.value.speed + speedPool.value)
                }

                speedPool.value = player.value.speed - activeEnemy.value.speed + speedPool.value
            }
        } else {
            // console.log(
            //     `Целая часть от деления по модулю: ${speedPool.value}/${player.value.speed}`,
            //     Math.abs(Math.trunc(speedPool.value / player.value.speed))
            // )
            if (Math.abs(Math.trunc(speedPool.value / player.value.speed)) >= 1) {
                // console.log('Передаем ход врагу')
                changeTurnOwner(activeEnemy.value)
                speedPool.value += player.value.speed
                fillBattleLog('Вы уступаете в скорости врагу. Ходит враг...')
                // console.log('После хода врага новый пул скорости будет: ', speedPool.value)
            } else {
                if (useIsPlayer(turnOwner.value)) {
                    // console.log('Прошлый ход был ходом игрока. Поэтому передаем ход врагу.')
                    changeTurnOwner(activeEnemy.value)

                    fillBattleLog('Враг заслужил свой ход...')
                    // console.log('После хода врага новый пул скорости будет: ', player.value.speed - activeEnemy.value.speed + speedPool.value)
                } else {
                    // console.log('Передаем ходу игроку.')
                    changeTurnOwner(player.value)

                    fillBattleLog('Теперь вы ходите...')
                    // console.log('После хода игрока новый пул скорости будет: ', player.value.speed - activeEnemy.value.speed + speedPool.value)
                }
                speedPool.value = player.value.speed - activeEnemy.value.speed + speedPool.value
            }
        }
    }

    /**
     * Сделал todo нанесение урона
     * Сделал todo система защиты. макс 1000 защиты. Но будет проблема, если защиты очень мало. Придумать так, если защиты
     *          меньше 100.
     * Сделал todo текст битвы
     * Сделал todo расчет отрицательной брони для стоек и нанесения урона
     * todo система агрессии и адреналина у врагов
     * todo система лута и смерть врага
     * todo система смерти игрока */

    function causedDamageText() {
        if (!useIsEnemy(activeEnemy.value) || !useIsPlayer(player.value)) return

        if (useIsPlayer(turnOwner.value)) {
            if (Math.trunc(activeEnemy.value.armor / 10) < 1) {
                return player.value.damage - 1
            } else {
                return player.value.damage - Math.ceil(activeEnemy.value.armor / 10)
            }
        } else {
            if (Math.trunc(player.value.armor / 10) < 1) {
                return activeEnemy.value.damage - 1
            } else {
                return activeEnemy.value.damage - Math.ceil(player.value.armor / 10)
            }
        }
    }
    /** todo вынести в хэндлер */
    const calcDamage = (player: Player, enemy: Enemy, attacker: 'player' | 'enemy') => {
        if (attacker === 'player') {
            if (enemy.armor >= 0) { // броня больше 0
                if (Math.trunc(enemy.armor / 10) < 1) {
                    enemy.health -= player.damage - 1
                } else {
                    enemy.health -= player.damage - Math.ceil(enemy.armor / 10)
                }
            } else { // броня меньше 0
                if (Math.abs(Math.trunc(enemy.armor / 10)) < 1) {
                    enemy.health -= player.damage + 1
                    // console.log('Игрок наносит', player.damage + 1)
                } else {
                    enemy.health -= player.damage + Math.abs(Math.ceil(enemy.armor / 10))
                    // console.log('Игрок наносит', player.damage + Math.abs(Math.ceil(enemy.armor / 10)))
                }
            }
        } else {
            if (player.armor >= 0) {
                if (Math.trunc(player.armor / 10) < 1) {
                    player.health -= enemy.damage - 1
                } else {
                    player.health -= enemy.damage - Math.ceil(player.armor / 10)
                }
            } else {
                if (Math.abs(Math.trunc(player.armor / 10)) < 1) {
                    player.health -= enemy.damage + 1
                } else {
                    player.health -= enemy.damage + Math.abs(Math.ceil(player.armor / 10))
                }
            }
        }
    }
    const attackHandler = () => {
        if (!useIsPlayer(player.value)) return
        if (!useIsEnemy(activeEnemy.value)) return;

        useIsPlayer(turnOwner.value) && calcDamage(player.value, activeEnemy.value, 'player')
        useIsEnemy(turnOwner.value) && calcDamage(player.value, activeEnemy.value, 'enemy')
    }
    // const endBattleHandler = () => {
    //     if (!useIsPlayer(player.value)) return
    //     if (!useIsEnemy(activeEnemy.value)) return;
    //
    //     if (player.value.health <= 0) {
    //         console.log('Сброс персонажа')
    //     }
    //     if (activeEnemy.value.health <= 0) {
    //         console.log('Сброс битвы и лутание лута')
    //     }
    // }
    //
    //
    const nextTurn = () => {
        toggleTurn()
        attackHandler()
        calculateSpeed()
        // endBattleHandler()
    }

    return {
        activeEnemy,
        turnNumber,
        turnOwner,
        playerAction,
        nextTurnOwnerMessage,
        battleLog,
        nextTurn,
        startBattle,
    } as BattleStoreInterface
})