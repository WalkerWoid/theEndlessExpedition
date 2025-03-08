import type {Character} from "@/classes/characters.ts";
import type {Characters} from "@/classes/characters.ts";
import type {DialogueButton} from "@/classes/characters.ts";

import {allCharacters} from "@/classes/characters.ts";


export interface Dialogue {
    activeCharacter: Character | undefined
    activeButton: DialogueButton | undefined
    characters: Characters
    setActiveCharacter(newActiveCharacter: Character | undefined): void
    setActiveButton(newActiveButton: DialogueButton | undefined): void
}

export const dialogues: Dialogue = {
    activeCharacter: undefined,
    activeButton: undefined,
    characters: allCharacters,
    setActiveCharacter(newActiveCharacter) {
        this.activeCharacter = newActiveCharacter
    },
    setActiveButton(newActiveButton) {
        this.activeButton = newActiveButton
    }
}