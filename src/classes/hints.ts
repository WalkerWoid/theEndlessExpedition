import type {WindowsVisibility} from "@/classes/windowsVisibility.ts";
import {watch} from "vue";
export interface Hint {
    title: string
    text: string
    wasNotified: boolean
    wasAdded: boolean
}
interface Hints {
    [key: string]: Hint
}
export interface AllHints {
    hints: Hints,
    newHints: number
    initHintsCount(playerJournal: Hint[]): void
    clearHint(hint: Hint): void
    addHint(playerJournal: Hint[], hintTitle: string, windowsVisibility: WindowsVisibility): void
}
export const allHints: AllHints = {
    hints: {
        awakingThoughts1: {
            title: 'awakingThoughts1',
            text: `Спустя два часа после пробуждения я все-таки нашел тетрадь и ручку, которые валялись около моих ног, 
            на самом видном месте. Пора записать всё с начала. Я очнулся в каком-то непонятном саркофаге. Голова 
            раскалывается. Первая мысль - я мертв, но чувство неумолимой жажды говорит об обратном. Я не знаю что это за
            место и кто я такой. Так же на меня надет непонятный скафандр, который снять пока не получается. Что делать 
            - тоже остается загадкой.`,
            wasNotified: true,
            wasAdded: false
        },
        awakingThoughts2: {
            title: 'awakingThoughts2',
            text: `При беглом осмотре саркофага выяснилось, что это не саркофаг а какая-то капсула с кучей систем 
            жизнеобеспечения. Экраны, экраны, экраны с миллионом разных показателей. Но один выделялся: зеленый 
            мониторчик, прямо над моим местом, с цифрой 1017. Что это значит? В голове пустота. В капсуле я нашёл 
            бортовой журнал. Запустить его оказалось проще простого. Это странно: я ничего не помню, но техническая 
            часть выглядит… понятной. Как будто мои руки знают, что делать, даже если мозг — нет. Амнезия?`,
            wasNotified: true,
            wasAdded: false
        },
        awakingThoughts3: {
            title: 'awakingThoughts3',
            text: `Судя по бортовому журналу, который капсула мне заботливо предоставила, я был отправлен на эту планету 
            с целью ее изучения. Воздух токсичен, фауна и флора - опасна. Поэтому я тут. Почему? Не могу сказать - 
            другая часть информации по какой-то причине недоступна. Мысли в кучу, сложно их изъяснять даже в голове. 
            Хочется пить и есть. Поищу еду и воду в капсуле.`,
            wasNotified: true,
            wasAdded: false
        },
        awakingThoughts4: {
            title: 'awakingThoughts4',
            text: `PS: наткнулся на "Пад", который предоставил мне всю информацию обо мне. Удобная вещь, разделил мне 
            всю информацию по окошкам. Даже какие-то "Рецепты" есть, и журнал. Отныне записываю свои наблюдения теперь 
            тут. Так же выкрою немного времени для изучения пада и, пожалуй, буду носить его с собой.`,
            wasNotified: true,
            wasAdded: false
        },
    },
    newHints: 0,
    initHintsCount(playerJournal) {
        console.log('initHintsCount')

        watch(() => playerJournal, (newLength) => {
            this.newHints = playerJournal.filter(hint => hint.wasNotified).length
        }, {deep: true})
    },
    clearHint(hint) {
        hint.wasNotified = false
    },
    addHint(playerJournal, hintTitle, windowsVisibility) {
        const neededHint = this.hints[hintTitle]
        console.log(windowsVisibility)

        if (!neededHint) return
        if (neededHint.wasAdded) return;

        // if (windowsVisibility.activeMainWindow !== 'Journal')
        //     this.newHints += 1

        neededHint.wasAdded = true
        playerJournal.push(neededHint)
    }
}

export const playerJournal: Hint[] = [] as Hint[]