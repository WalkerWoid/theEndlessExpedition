export interface WindowsVisibility {
    mainWindowVisibility: boolean
    activeMainWindow: string
    dialogueWindowVisibility: boolean
    statusBarVisibility: boolean
}

export const windowsVisibilityObj: WindowsVisibility = {
    mainWindowVisibility: true,
    activeMainWindow: 'Quests',
    dialogueWindowVisibility: false,
    statusBarVisibility: true,
}