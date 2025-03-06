export interface Notification {
    text: string
    secondText: string
    className: string
}
export interface Notifications {
    notifications: Notification[]
    showNotification(entryObj: any, action: string): void
}


export const notificationsObj: Notifications = {
    notifications: [] as Notification[],
    showNotification(entryObj: any, action: string): void {
        const newNote: Notification = {
            text: 'Сломано',
            secondText: 'Наручи из жопы дракона',
            className: '_green'
        }

        switch (action) {
            case 'moveLocation':
                newNote.text = 'Переходим в'
                newNote.secondText = entryObj.accusativeSingular
                break
            case 'farmResource':
                newNote.text = '+'
                newNote.secondText = `${entryObj.name}: ${entryObj.count}`
                break
            case 'notFarmResource':
                newNote.text = 'Ничего не получили'
                newNote.secondText = ``
                newNote.className = '_red'
                break
            case 'decreaseResource':
                newNote.text = '-'
                newNote.secondText = `${entryObj.name}: ${entryObj.count}`
                newNote.className = '_red'
                break
            case 'createItem':
                newNote.text = 'Создано'
                newNote.secondText = `${entryObj.name}`
                break
            case 'cantCreate':
                newNote.text = 'Нехватает ресурсов'
                newNote.secondText = ``
                newNote.className = '_red'
                break
            case 'equalItemEquipped':
                newNote.text = 'Этот предмет уже надет!'
                newNote.secondText = ``
                newNote.className = '_red'
                break
            case 'putOnItem':
                newNote.text = 'Надеваем: '
                newNote.secondText = `${entryObj.name}`
                break
            case 'takeOffItem':
                newNote.text = 'Снимаем: '
                newNote.secondText = `${entryObj.name}`
                newNote.className = '_red'
                break
            case 'notEqualEquippedItem':
                newNote.text = 'Выберите надетый предмет'
                newNote.secondText = ``
                newNote.className = '_red'
                break
            case 'itemNotEquipped':
                newNote.text = 'Ничего не надето'
                newNote.secondText = ``
                newNote.className = '_red'
                break
            case 'addPositiveEffect':
                newNote.text = 'Получено: '
                newNote.secondText = `${entryObj.name}`
                break
            case 'addNegativeEffect':
                newNote.text = 'Получено: '
                newNote.secondText = `${entryObj.name}`
                newNote.className = '_red'
                break
        }

        this.notifications.unshift(newNote)
        setTimeout(() => {
            this.notifications.pop()
        }, 2400)
    }
}