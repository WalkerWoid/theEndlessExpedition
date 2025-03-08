import type {InventoryItemsTypes} from "@/classes/player.ts";

interface FarmResourceConsequence {
    type: 'farmResources',
    resources: InventoryItemsTypes[]
}

type ButtonConsequence = FarmResourceConsequence
interface AdditionalButton {
    text: string
    next: string
    visibility: boolean
    consequences?: ButtonConsequence[]
}
interface SecondaryButton {
    text: string[]
    additionalButtons?: {
        [key: string]: AdditionalButton
    }
}
export interface DialogueButton {
    id: string
    title: string
    once: boolean
    visibility: boolean
    messages: SecondaryButton
    allAdditionalButtons?: {
        [key: string]: SecondaryButton
    }
}
export interface Character {
    id: number
    name: string
    engName: string
    description: string
    imgSrc: string
    met: boolean
    dialogue: {
        [key: string]: DialogueButton
    }
}
export interface Characters {
    [key: string]: Character
}

export const allCharacters: Characters = {
    satyr: {
        id: 0,
        name: 'Фа\'вн',
        engName: 'satyr',
        description: `Спиной к вам стоит сатир, полностью волосатый с головы до пят. На его шее виднеется полосатый
        зеленый шарф. Сатир напевает какую-то мелодию, не обращая на вас никакого внимания. Или же это вы не
        представляете для сатира никакой опасности?`,
        imgSrc: '',
        met: false,
        dialogue: {
            helloBtn: {
                id: 'helloBtn',
                title: 'Поприветствовать',
                once: false,
                visibility: true,
                messages: {
                    text: [
                        `Вы окликнули сатира, стоящего к вам спиной. Тот лишь легонько повел ухом, а через секунду,
                        словно ошарашенный, прыжком повернулся к вам:`,
                        `- Ох, привет. Я тебя не заметил. Я Фа'вн, сатир с Великих полей. А тебя как зовут? В прочем,
                        неважно. Мне это, все-равно, не очень-то и интересно!`,
                    ],
                    additionalButtons: {
                        beatSatyr: {
                            text: 'Ударить сатира',
                            next: 'beatSatyr',
                            visibility: true,
                        },
                        askResources: {
                            text: 'Попросить ресурсы',
                            next: 'askResources',
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
                                }
                            ]
                        }
                    }
                },
                allAdditionalButtons: {
                    beatSatyr: {
                        text: ['Вы ударили сатира']
                    },
                    askResources: {
                        text: ['Вы попросили ресурсы']
                    }
                }
            },
            askSome: {
                id: 'askSome',
                title: 'Спросить о чем-нибудь',
                once: false,
                visibility: true,
                messages: {
                    text: [
                        `Вы вот вот хотели спросить сатира о чем-нибудь, но он лишь покачал головой, не желая продолжать 
                        с вами диалог.`
                    ]
                }
            }
        }
    }
}























