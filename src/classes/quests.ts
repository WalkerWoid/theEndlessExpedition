import {watch} from "vue";
import type {Inventory, InventoryResourceSimple} from "@/classes/player.ts";
import type {InventoryItemsTypes} from "@/classes/player.ts";

type SimpleConditions = string[]
type ResourcesFarmedCondition = InventoryItemsTypes[]
type AllConditionsTypes =  SimpleConditions | ResourcesFarmedCondition
export interface Conditions {
    simpleConditions?: SimpleConditions
    resourcesFarmed?: ResourcesFarmedCondition
}

export interface Quest {
    id: string
    title: string
    text: string
    text2: string
    hint: string
    status: 'inProgress' | 'completed'
    wasStarted: boolean
    isNew: boolean
    conditions: Conditions
    awards: boolean
    visibility: boolean
}
export interface AllQuest {
    [key: string]: Quest
}
const quests: AllQuest = {
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
            simpleConditions: [
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
            планете. Ресурсы пригодятся для крафта. Так, а что, собственно, я буду крафтить то? Ладно, как соберу 
            ресурсы так и займусь решением этой проблемы.`,
        text2: `Начальные ресурсы собраны. Теперь необходимо спросить БЖ - я теперь бортовой журнал буду называть 
            именно так - на что мне их тратить?`,
        hint: 'Собрать 120 веток, 200 травы, 12 цветов и 5 камушков. И куда столько? На соломенный дом?',
        status: 'inProgress',
        wasStarted: false,
        isNew: true,
        conditions: {
            resourcesFarmed: [
                {name: 'Ветка', engName: 'stick', count: 120, type: 'resource'},
                {name: 'Трава', engName: 'grass', count: 200, type: 'resource'},
                {name: 'Обычный цветок', engName: 'commonFlower', count: 12, type: 'resource'},
                {name: 'Камушек', engName: 'littleStone', count: 5, type: 'resource'},
            ],
        },
        awards: false,
        visibility: true,
    },
}

export interface Quests {
    quests: AllQuest
    activeQuests: Quest[]
    conditions: string[]
    newQuests: number
    initQuestsCount(): void
    addQuest(questId: string): void
    clearQuest(activeQuest: Quest): void
    checkQuest(quest: Quest, inventory: Inventory): void
    checkSimpleCondition(quest: Quest): boolean
    checkResourcesFarmedCondition(quest: Quest, inventory: Inventory): boolean
    addSimpleCondition(condition: string): void
    hideQuest(quest: Quest): void
}
export const allQuests: Quests = {
    quests: quests,
    activeQuests: [] as Quest[],
    conditions: [] as string[],
    newQuests: 0,
    initQuestsCount() {
        watch(() => this.activeQuests, (newActiveQuests) => {
            this.newQuests = this.activeQuests.filter(quest => quest.isNew).length
        }, {deep: true})
    },
    addQuest(questId) {
        const quest = this.quests[questId]

        if (quest.wasStarted) return console.log('Квест не добавили')

        quest.wasStarted = true
        this.activeQuests.push(quest)
    },
    clearQuest(activeQuest) {
        if (!activeQuest.isNew) return

        activeQuest.isNew = false
        console.log(this.activeQuests);
    },
    checkQuest(quest: Quest, inventory) {
        let isQuestCompleted = true

        for (const questCondition in quest.conditions as Conditions) {
            if (!questCondition) return isQuestCompleted = false

            if (quest.conditions['simpleConditions']) {
                isQuestCompleted = this.checkSimpleCondition(quest)
            } else if (quest.conditions['resourcesFarmed']) {
                isQuestCompleted = this.checkResourcesFarmedCondition(quest, inventory)
            } else {
                isQuestCompleted = false
            }
        }

        if (!isQuestCompleted) quest.status = 'inProgress'
        else {
            quest.status = 'completed'
            quest.text = quest.text2
            quest.hint = 'Квест завершен. Что бы скрыть его, кликните по названию квеста.'
        }
    },
    checkSimpleCondition(quest) {
        let isCompleted = true
        const simpleConditions = quest.conditions['simpleConditions']

        if (!simpleConditions) isCompleted = false
        else {
            simpleConditions.forEach((simpleCondition: string) => {
                if (!this.conditions.find(condition => condition === simpleCondition)) isCompleted = false
            })
        }


        return isCompleted
    },
    checkResourcesFarmedCondition(quest, inventory) {
        console.log(2)
        let isCompleted = true
        const resourcesFarmedCondition = quest.conditions['resourcesFarmed']

        if (!resourcesFarmedCondition) isCompleted = false
        else {
            resourcesFarmedCondition.forEach((resource: InventoryItemsTypes) => {
                const inventoryResource = inventory.getInventoryResource(resource)

                if (!inventoryResource) isCompleted = false
                else if (resource.count > inventoryResource.count) {
                    isCompleted = false
                }
            })
        }



        return isCompleted
    },
    addSimpleCondition(condition) {
        this.conditions.push(condition)
    },
    hideQuest(quest: Quest) {
        quest.visibility = false
    }
}