import type {AllCharacters, Character, DialogueButton} from "@/classes/characters.ts";

import {allCharacters} from "@/classes/characters.ts";

export interface Dialogue {
    characters: AllCharacters
    activeCharacter: Character
    activeButton: DialogueButton
    setActiveCharacter(newCharacterName: string): void
    setActiveCharacterPlaceholder(): void
    getPlaceholderCharacter(): Character

    getCharacterDialogue(): DialogueButton[]

    setActiveButton(newButton: DialogueButton): void
    setActiveButtonPlaceholder(): void
    getPlaceholderButton(): DialogueButton
    handleOnceDialogueButton(dialogueButton: DialogueButton): void
    handleMetCharacter(): void
}
export const dialogues: Dialogue = {
    characters: allCharacters,
    activeCharacter: allCharacters.placeholder,
    activeButton: allCharacters.placeholder.allButtons.buttonPlaceholder,
    setActiveCharacter(newCharacterName) {
        const newActiveCharacter = allCharacters[newCharacterName]

        if (newActiveCharacter) this.activeCharacter = newActiveCharacter
        else this.setActiveCharacterPlaceholder()

        this.handleMetCharacter()
    },
    setActiveCharacterPlaceholder() {
        this.activeCharacter = this.getPlaceholderCharacter()
    },
    getPlaceholderCharacter() {
        return this.characters.placeholder
    },


    getCharacterDialogue() {
        const dialogue = [] as DialogueButton[]

        this.activeCharacter.startedButtons.forEach(btn => {
            const dialogueButton = this.activeCharacter.allButtons[btn]
            dialogue.push(dialogueButton)
        })

        return dialogue
    },


    setActiveButton(newButton: DialogueButton) {
        this.activeButton = newButton
        this.handleOnceDialogueButton(this.activeButton)
        console.log(this)
    },
    setActiveButtonPlaceholder() {
        this.activeButton = this.getPlaceholderButton()
    },
    getPlaceholderButton(): DialogueButton {
        return this.getPlaceholderCharacter().allButtons.buttonPlaceholder
    },
    handleOnceDialogueButton(dialogueButton: DialogueButton) {
        if (!dialogueButton.once) return

        const dialogueButtonIndex: number = this.activeCharacter.startedButtons.indexOf(dialogueButton.id)
        this.activeCharacter.startedButtons.splice(dialogueButtonIndex, 1)
    },
    handleMetCharacter() {
        this.activeCharacter.met = true
    }
}