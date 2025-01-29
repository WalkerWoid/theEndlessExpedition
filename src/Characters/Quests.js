/**
 * @type {Quests}
 * @typedef {Object} quest
 *
 * @param {string} id - текстовый id квеста. Такой же, как и ключ квеста
 * @param {string} title - название квеста
 * @param {string} text - описание квеста
 * @param {string} hint - подсказка к квесту
 * @param {string} status - статус квеста. inProgress | completed
 * @param {boolean} wasStarted - был ли начат квест. Отвечат за то, будет ли добавляться квест еще, или нет
 * @param {boolean} isNew - видели ли мы квест или нет. Около квеста будет появляться "новый!"
 * @param {Object} conditions - условия выполнения задания
 * @param {array || boolean} awards - награды, выдаваемые за задания
 *
 * */
const quests = {
    checkMyStatus: {
        id: 'checkMyStatus',
        title: 'Каков мой статус?',
        text: `Осужденный по законам? Так, нет-нет-нет. Это какая-то ошибка. Надо поискать информацию в бортовом журнале`,
        text2: `Понятно. Я убил какую-то там крутую принцессу, поэтому я оказался на этой планете.`,
        hint: 'В окне локации поговорить с бортвым журналом.',
        status: 'inProgress',
        wasStarted: false,
        isNew: true,
        conditions: {
            otherConditions: [
                'spokeWithLogbook'
            ]
        },
        awards: false,
        visibility: true
    },
    farmResources: {
        id: 'farmResources',
        title: 'Необходимо собрать начальные ресурсы.',
        text: `Как и сказал бортовой журнал, мне необходимо собрать начальные ресурсы, если я хочу выжить на этой 
        планете. Ресурсы пригодятся для крафта. Так, а что, собственно, я буду крафтить то? Ладно, как соберу ресурсы
        так и займусь решением этой проблемы.`,
        text2: `Начальные ресурсы собраны. Теперь необходимо спросить БЖ - я теперь бортовой журнал буду называть именно 
        так - на что мне их тратить?`,
        hint: 'Собрать 120 веток, 200 травы, 12 цветов и 5 камушков. И куда столько? На соломенный дом?',
        status: 'inProgress',
        wasStarted: false,
        isNew: true,
        conditions: {
            resourcesFarmed: {
                stick: 120,
                grass: 200,
                commonFlower: 12,
                littleStone: 5
            },
        },
        awards: false,
        visibility: true,
    }
}

class Quests {
    constructor() {
        this.quests = quests
    }
    addQuest(arrayToAdd, quest) {
        if (quest.wasStarted) {
            console.log('Не добавили квест')
            return
        }

        quest.wasStarted = true
        arrayToAdd[quest.id] = quest
        console.log('добавили квест')
    }
    checkQuest(quest, player) {
        console.log('Квест, который проверяем', quest)
        let isQuestCompleted = true
        const {resourcesFarmed, otherConditions} = quest.conditions

        if (resourcesFarmed) {
            for (const resource in resourcesFarmed) {
                if (resourcesFarmed[resource] > player.getInventoryResource({engName: resource}).count) {
                    isQuestCompleted = false
                    console.log(player.getInventoryResource({engName: resource}))
                }
            }
            console.log(player.inventory)
        }
        if (otherConditions) {
            for (const condition of otherConditions) {
                if (!player.conditions.find(cond => cond === condition)) {
                    isQuestCompleted = false
                }
            }
        }

        if (!isQuestCompleted) quest.status = 'inProgress'
        else {
            quest.status = 'completed'
            quest.text = quest.text2
            quest.hint = 'Квест завершен. Что бы скрыть его, кликните по названию.'
        }

        // if (quest.questType === 'resources') {
        //     isQuestCompleted = this.secondCheck(isQuestCompleted, quest, player)
        //     console.log('Заходим во второй квест чек')
        // } else {
        //     for (const condition in quest.conditions) {
        //         console.log(quest.conditions[condition])
        //         if (quest.conditions[condition] !== true) isQuestCompleted = false
        //     }
        // }
        //
        // if (!isQuestCompleted) quest.status = 'inProgress'
        // else {
        //     quest.status = 'completed'
        //     quest.text = quest.text2
        //     quest.hint = 'Квест завершен. Что бы скрыть его, кликните по названию.'
        // }
    }
    secondCheck(isQuestCompleted, quest, player) {
        // const {spokeWith, placesVisited, itemsCreated, resourcesFarmed} = quest.conditions
        //
        // if (resourcesFarmed) {
        //     for (const resource in resourcesFarmed) {
        //         if (resourcesFarmed[resource] > player.getInventoryResource({engName: resource}).count) {
        //             isQuestCompleted = false
        //             console.log(player.getInventoryResource({engName: resource}))
        //         }
        //     }
        //     console.log(player.inventory)
        // }
        //
        // return isQuestCompleted
    }
    // changeQuestCondition(quest, conditionTitle) {
    //     quest.conditions[conditionTitle] = true
    // }
}

export default Quests

/**
 * todo придумать архитектуру объекта заданий
 * todo придумать как и по каким условиям будет отслеживаться прогресс заданий. Может быть, по тикам?
 *
 * todo сделать метод добавления квестов. В методе будет обработка квестов: добавление новых кнопок диалогов, кнопок
 *  локаций и так далее.
 *
 * todo Для локаций,
 * */