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
        }

        this.notifications.unshift(newNote)
        const timeOut = setTimeout(() => {
            this.notifications.pop()
        }, 2400)
    }
}