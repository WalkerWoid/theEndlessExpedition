export interface WindowsVisibility {
    mainWindowVisibility: boolean
    activeMainWindow: string
    dialogueWindowVisibility: boolean
    statusBarVisibility: boolean
    battleWindowVisibility: boolean
}

export const windowsVisibilityObj: WindowsVisibility = {
    mainWindowVisibility: true,
    activeMainWindow: 'Hunt',
    dialogueWindowVisibility: false,
    statusBarVisibility: true,
    battleWindowVisibility: false
}