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
}
export const dialogues: Dialogue = {
    characters: allCharacters,
    activeCharacter: allCharacters.placeholder,
    activeButton: allCharacters.placeholder.allButtons.buttonPlaceholder,
    setActiveCharacter(newCharacterName) {
        const newActiveCharacter = allCharacters[newCharacterName]

        if (newActiveCharacter) this.activeCharacter = newActiveCharacter
        else this.setActiveCharacterPlaceholder()
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
            dialogue.push(this.activeCharacter.allButtons[btn])
        })

        return dialogue
    },


    setActiveButton(newButton: DialogueButton) {
        this.activeButton = newButton
        console.log(this.activeButton)
    },
    setActiveButtonPlaceholder() {
        this.activeButton = this.getPlaceholderButton()
    },
    getPlaceholderButton(): DialogueButton {
        return this.getPlaceholderCharacter().allButtons.buttonPlaceholder
    }
}