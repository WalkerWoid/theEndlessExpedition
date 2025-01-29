/**
 *
 * todo полноценное окно диалогов, которое появляется поверх всех других окон
 */

const characters = {
    logbook: {
        id: 1,
        name: 'Бортовой журнал',
        description: 'Компьютеры тихонько пискнули, отвечая на ваше присутствие.',
        imgSrc: '',
        met: true,
        dialogue: {
            testBtn: {
                id: 'testBtn',
                title: 'Тестовая кнопка',
                once: false,
                visibility: true,
                messages: {
                    text: ['текст заглушка'],
                    additionalButtons: {
                        testBtn: {
                            text: 'Первая тестовая кнопка', next: 'testAdditional1', visibility: true,
                            consequences: [
                                {
                                    type: 'addPlayerCondition',
                                    conditionTitle: 'spokeWithLogbook'
                                }
                            ]
                        },
                    }
                },
                testAdditional1: {
                    text: [
                        'текст1 второй кнопки',
                        'текст2 второй кнопки'
                    ]
                }
            },
            knowMyStatus: {
                id: 'knowMyStatus',
                title: 'Узнать о своем статусе',
                once: true,
                visibility: false,
                messages: {
                    text: [
                        'Ой а почему у меня такой страшный статус?',
                        'А потому что в прошлом ты был страшным убийцей!',
                        'Ааа, страшно!'
                    ]
                }
            }
        }
    },
    satyr: {
        id: 0,
        name: 'Сатир с великих полей',
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
                        beatSatyr: { text: 'Поставить Наглого сатира на место', next: 'beatSatyr', visibility: true },
                        listenSilently: {
                            text: 'Молча слушать', next: 'listenSilently', visibility: true,
                            consequences: [
                                {
                                    type: 'changeButtonVisibility',
                                    character: 'logbook', // всегда
                                    mainButton: 'testBtn', // всегда
                                    action: 'show', // всегда
                                    secondButton: false, // опционально
                                    additionalButton: false // опционально
                                }
                            ]
                        },
                    }
                },
                beatSatyr: {
                    text: [
                        `Одним резким ударом вы попали сатиру в бровь, после чего он сильно заскулил и упал на пол.`,
                        `Наглый козел теперь будет знать, с кем он имеет дело. А именно - с вами.`
                    ],
                },
                listenSilently: {
                    text: [
                        `С некоторой снисходительностью вы улыбнулись, глядя прямо сатиру в глаза. Его
                        продолговатые зрачки с жадностью разглядывали вас, вызывая неподдельный интерес. Через секунду
                        Фа'вн отвел взгляд:`,
                        `- Ну, чего хотел то? У меня не очень много времени.`
                    ]
                },
                askForgiveness: {
                    text: [
                        `Вы сжалились над козленком и простили его за дерзость, которую он проявил. Вы молодцы. Плюс в карму!`,
                        `Он удивленно посмотрел на вас, затем встал и молвил`,
                        `- Ладно, прощаю, черт с тобой, - махнул рукой и пошатываясь побрел в сторону ближайшего леса.`
                    ]
                }
            },
            askResources: {
                id: 'askResources',
                title: 'Дела капитальные',
                once: false,
                visibility: true,
                messages: {
                    text: [
                        `Вы нашли Фа'вна на том же месте - сидящего под деревом и читающего книгу:`,
                        `- Дорогой друг, что тебя привело ко мне?`
                    ],
                    additionalButtons: {
                        askResourcesByGood: { text: 'Попросить ресурсы', next: 'askResourcesByGood', visibility: true, },
                        askResourcesByBad: {
                            text: 'Попросить ресурсы с угрозой', next: 'askResourcesByBad', visibility: true,
                            consequences: [
                                {
                                    type: 'changeButtonVisibility',
                                    character: 'satyr', // всегда
                                    mainButton: 'askResources', // всегда
                                    action: 'hide', // всегда
                                    secondButton: 'askResourcesByGood', // опционально
                                    additionalButton: 'inspectStump' // опционально
                                }
                            ]
                        }
                    }
                },
                askResourcesByGood: {
                    text: [
                        `Вы и рот открыть не успели, как сатир продолжил:`,
                        `- В-и-и-и-и-жу, - протянул он, - снова нехватает ресурсов? Я предвидел такой исход, - не
                        переставая читать книгу, он продолжил:`,
                        `- Под трухлявым пнем у которого ты стоишь я припрятал немного камней и веток. Можешь забрать
                        себе.`,
                    ],
                    additionalButtons: {
                        inspectStump: {
                            text: 'Искать под пнем',
                            next: 'inspectStump',
                            visibility: true,
                            consequences: [
                                {
                                    type: 'farmResources',
                                    resources: [
                                        { "name": "Ветка", "engName": "stick", "count": 4, "type": "resource" },
                                        { "name": "Камешек", "engName": "littleStone", "count": 5, "type": "resource" }
                                    ]
                                },
                                {
                                    type: 'changeButtonVisibility',
                                    character: 'satyr', // всегда
                                    mainButton: 'askResources', // всегда
                                    action: 'hide', // всегда
                                    secondButton: false, // опционально
                                    additionalButton: 'askResourcesByBad' // опционально
                                }
                            ]
                        },
                    },
                },
                inspectStump: {
                    text: [
                        `Просунув руку под пень, вы нащупали связку веток и мешок с камушками. Молча поблагодарив сатира,
                            вы сунули находку в рюкзак.`
                    ]
                },
                askResourcesByBad: {
                    text: [
                        `Текст заглушка`
                    ]
                }
            }
        }
    }
}
class Dialogues {
    constructor() {
        this.characters = characters
        this.activeCharacter = undefined // персонаж, с которым ведется диалог
        this.activeButton = undefined // активная кнопка диалога
        this.activeMessages = undefined // массив активных сообщений активной кнопки
    }

    switchActiveCharacter(newCharacter = undefined) {
        this.activeCharacter = characters[newCharacter]
        if (this.activeCharacter)
            this.activeCharacter.met = true
        console.log(this.characters)
    }
    switchActiveButton(newButton = undefined) {
        console.log('Новая активная кнопка', newButton)

        this.activeButton = newButton
        this.activeButton && this.switchActiveMessages(this.activeButton.messages)
    }
    switchActiveMessages(newMessages = undefined) {
        this.activeMessages = newMessages
    }

    clearDialogue() {
        this.switchActiveCharacter()
        this.switchActiveButton()
        this.switchActiveMessages()
    }
    backDialogue() {
        if (this.activeButton.once) {
            this.activeCharacter.dialogue[this.activeButton.id].visibility = false
        }

        this.switchActiveButton()
        this.switchActiveMessages()
    }

    handleButton(button, player) {
        this.switchActiveMessages(this.activeButton[button.next])
        console.log(button)

        if (!button.consequences)
            return

        button.consequences.forEach(consequence => {
            this.handleConsequence(consequence, player)
        })
    }
    handleConsequence(consequence, player, button = {}) {
        console.log(button);
        const farmResource = () => {
            /** Пример объекта consequence:
                {
                    type: 'farmResources',
                    resources: [
                        { "name": "Ветка", "engName": "stick", "count": 4, "type": "resource" },
                        { "name": "Камешек", "engName": "littleStone", "count": 5, "type": "resource" }
                    ]
                }
            */
            const {resources} = consequence

            resources.forEach(resource => player.addResource(resource))
        }
        const changeButtonVisibility = () => {
            console.clear()
            /** Пример объекта consequence:
                {
                    type: 'changeButtonVisibility',
                    character: 'satyr', // всегда
                    mainButton: 'askResources', // всегда
                    action: 'hide', // всегда
                    secondButton: 'askResourcesByGood', // опционально. Если не указана, меняется видимость
                                                        additionalButton в messages главной кнопки.
                    additionalButton: 'inspectStump' // опционально. Если не указана - меняется видимость главной кнопка
                }
             */

            const {
                character: characterName,
                mainButton: mainButtonTitle,
                action,
                additionalButton: additionalButtonTitle,
                secondButton
            } = consequence

            if (!this.characters[characterName]
                || !this.characters[characterName].dialogue[mainButtonTitle]
                || !this.characters[characterName].met) {
                console.log('Такого персонажа или кнопки диалога у персонажа пока нет, или она не видна еще!')
                return
            }

            console.log('Персонаж или кнопка диалога существует!')

            if (action === 'hide') {
                changeButton(characterName, mainButtonTitle, additionalButtonTitle, secondButton, false)
            }
            if (action === 'show') {
                changeButton(characterName, mainButtonTitle, additionalButtonTitle, secondButton, true)
            }
        }
        const changeButton = (characterName, mainButtonTitle, additionalButtonTitle, secondButton, changeAt) => {
            const neededCharacter = this.characters[characterName]
            const neededMainButton = neededCharacter.dialogue[mainButtonTitle]

            if (!additionalButtonTitle) {
                neededMainButton.visibility = changeAt
                return
            }

            if (!secondButton) {
                neededMainButton.messages.additionalButtons[additionalButtonTitle].visibility = changeAt
                console.log(neededCharacter);
            } else {
                neededMainButton[secondButton].additionalButtons[additionalButtonTitle].visibility = changeAt
                console.log(neededCharacter)
            }
        }

        const addPlayerCondition = () => {
            /** Пример объекта consequence:
                {
                    type: 'addPlayerCondition',
                    conditionTitle: 'spokeWithLogbook'
                }
            */
            const {conditionTitle} = consequence

            player.addCondition(conditionTitle)
        }

        switch (consequence.type) {
            case "farmResources":
                farmResource()
                break
            case "changeButtonVisibility":
                changeButtonVisibility()
                break
            case "addPlayerCondition":
                addPlayerCondition()
                break
        }
    }

}

export default Dialogues

/**
 *  Сделал - todo - Реализовать систему диалогов
 *  Сделал - todo - Возможность удаления главных кнопок
 *  Сделал - todo - Возможность удаления дополнительных кнопок
 *  Сделал - todo - Возможность добавления других кнопок
 *  todo - Возможность удаления определенных кнопок
 *  todo - Возможность добавления определенных квестов
 *  todo - Возможность выполнения определенных квестов при клике на кнопку
 *  Сделал - todo - Добавить ключевые слова в consequences для определения, на что будет влиять нажатие на кнопку
 *              определенного диалога
 *  Сделал - todo - Добавить once для отметки определенного диалога как единовременного и последующего его удаления из
 *              дерева диалогов
 *  todo - Добавить отображение определенных кнопкок и диалогов по определенным условиям conditions
 */

