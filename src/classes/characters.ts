import type {InventoryItemsTypes} from "@/classes/player.ts";

interface FarmResourceConsequence {
    type: 'farmResources',
    resources: InventoryItemsTypes[]
}
interface AddDialogueButton {
    type: 'addDialogueButton'
    characterName: string
    dialogueButtonTitle: string
}
interface AddChoiceButtonToDialogueButton {
    type: 'addChoiceButton'
    characterName: string
    dialogueButtonTitle: string
    choiceButtonTitle: string
}
export type ButtonConsequence = FarmResourceConsequence | AddDialogueButton | AddChoiceButtonToDialogueButton

export interface ChoiceButton {
    text: string
    next: string
    once: boolean
    visibility: boolean
    consequences: ButtonConsequence[]
}
export interface DialogueButton {
    id: string
    title: string
    once: boolean
    messages: string[]
    choiceButtons: ChoiceButton[]
}
export interface Character {
    id: number
    name: string
    engName: string
    description: string
    imgSrc: string
    met: boolean
    startedButtons: string[]
    allButtons: {
        [key: string]: DialogueButton
    }
}
export interface AllCharacters {
    [key: string]: Character
}
export const allCharacters: AllCharacters = {
    placeholder: {
        id: -1,
        name: '-',
        engName: 'placeholder',
        description: `Описания персонажа нет`,
        imgSrc: '',
        met: false,
        startedButtons: ['buttonPlaceholder'],
        allButtons: {
            buttonPlaceholder: {
                id: 'buttonPlaceholder',
                title: 'Пустая кнопка',
                once: false,
                messages: ['Диалог заглушка'],
                choiceButtons: [
                    {
                        text: 'Текст',
                        next: '',
                        once: false,
                        visibility: true,
                        consequences: []
                    }
                ]
            }
        },
    },
    satyr: {
        id: 0,
        name: 'Фа\'вн',
        engName: 'satyr',
        description: `Спиной к вам стоит сатир, полностью волосатый с головы до пят. На его шее виднеется полосатый
        зеленый шарф. Сатир напевает какую-то мелодию, не обращая на вас никакого внимания. Или же это вы не
        представляете для сатира никакой опасности?`,
        imgSrc: '',
        met: false,
        startedButtons: ['helloBtn', 'askSome'],
        allButtons: {
            helloBtn: {
                id: 'helloBtn',
                title: 'Поприветствовать',
                once: true,
                messages: [
                    `Вы окликнули сатира, стоящего к вам спиной. Тот лишь легонько повел ухом, а через секунду,
                        словно ошарашенный, прыжком повернулся к вам:`,
                    `- Ох, привет. Я тебя не заметил. Я Фа'вн, сатир с Великих полей. А тебя как зовут? В прочем,
                        неважно. Мне это, все-равно, не очень-то и интересно!`,
                ],
                choiceButtons: [
                    {
                        text: 'Ударить сатира',
                        next: 'beatSatyr',
                        once: true,
                        visibility: true,
                        consequences: []
                    },
                    {
                        text: 'Попросить ресурсы',
                        next: 'askResources',
                        once: true,
                        visibility: true,
                        consequences: [
                            {
                                type: 'farmResources',
                                resources: [
                                    {
                                        name: "Трава",
                                        engName: "grass",
                                        count: 80,
                                        type: "resource"
                                    },
                                ]
                            },
                            {
                                type: 'addDialogueButton',
                                characterName: 'satyr',
                                dialogueButtonTitle: 'aboutResources'
                            },
                            {
                                type: 'addChoiceButton',
                                characterName: 'satyr',
                                dialogueButtonTitle: 'aboutResources',
                                choiceButtonTitle: 'threatenToKillHim'
                            }
                        ]
                    }
                ]
            },
            askSome: {
                id: 'askSome',
                title: 'Спросить что-нибудь',
                once: false,
                messages: [
                    `Вы вот вот хотели спросить сатира о чем-нибудь, но он лишь покачал головой, не желая продолжать
                    с вами диалог.`
                ],
                choiceButtons: [],
            },
            beatSatyr: {
                id: 'beatSatyr',
                title: 'Ударить сатира',
                once: false,
                messages: ['Вы ударили сатира по голове'],
                choiceButtons: [
                    {
                        text: 'Попросить прощения',
                        next: 'askForgiveness',
                        once: false,
                        visibility: true,
                        consequences: []
                    }
                ]
            },
            askResources: {
                id: 'askResources',
                title: 'Попросить ресурсы',
                once: false,
                messages: ['Вы попросили ресурсы'],
                choiceButtons: []
            },
            askForgiveness: {
                id: 'askForgiveness',
                title: 'Попросить прощения',
                once: false,
                messages: ['Вы попросили прощения, но сатир не простил вас. Почему же?'],
                choiceButtons: []
            },
            aboutResources: {
                id: 'aboutResources',
                title: 'Поставки новых ресурсов',
                once: false,
                messages: ['Вы хотите больше ресурсов, но у наглого козла их нет'],
                choiceButtons: [
                    {
                        text: 'Угрожать',
                        next: 'threatenToKillHim',
                        once: false,
                        visibility: false,
                        consequences: [
                            {
                                type: 'farmResources',
                                resources: [
                                    {
                                        name: "Трава",
                                        engName: "grass",
                                        count: 80,
                                        type: "resource"
                                    },
                                ]
                            }
                        ]
                    }
                ]
            },
            threatenToKillHim: {
                id: 'threatenToKillHim',
                title: 'Угрожать его жизни',
                once: false,
                messages: ['Вы пригрозили ему и он готов отдать вам свои ресурсы'],
                choiceButtons: []
            }
        }
    }
}


















