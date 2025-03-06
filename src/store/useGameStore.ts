import {defineStore} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import type {Ref} from "vue";
import type {ComputedRef} from "vue";

import type {Notifications} from "@/classes/notifications.ts";
import type {Player} from "@/classes/player.ts";
import type {Location} from "@/classes/allLocations.ts";
import type {WindowsVisibility} from "@/classes/windowsVisibility.ts";
import type {AllRecipes} from "@/classes/allRecipes.ts";
import type {AllHints} from "@/classes/hints.ts";
import type {Hint} from "@/classes/hints.ts";

import {playerObj} from "@/classes/player.ts";
import {allLocations} from "@/classes/allLocations.ts";
import {notificationsObj} from "@/classes/notifications.ts";
import {windowsVisibilityObj} from "@/classes/windowsVisibility.ts";
import {allRecipes} from "@/classes/allRecipes.ts";
import {allHints} from "@/classes/hints.ts";
import {playerJournal} from "@/classes/hints.ts";

export interface GameStore {
    player: Player
    locations: Ref<Location[]>
    notifications: Notifications
    windowsVisibility: WindowsVisibility
    currentLocationObj: ComputedRef<Location | undefined>
    recipes: AllRecipes
    hints: AllHints
    journal: Ref<Hint[]>
    getCurrentLocationObj(title: string): Location
}

export const useGameStore = defineStore('gameStore', () => {
    const player = reactive(playerObj)
    const locations = ref(allLocations)
    const notifications = reactive(notificationsObj)
    const windowsVisibility = reactive(windowsVisibilityObj)
    const recipes = reactive(allRecipes)
    const hints = reactive(allHints)
    const journal = ref(playerJournal)

    const currentLocationObj = computed<Location | undefined>(() => {
        return getCurrentLocationObj(player.currentLocationTitle)
    })

    hints.initHintsCount(journal.value)
    hints.addHint(journal.value, 'awakingThoughts1')
    hints.addHint(journal.value, 'awakingThoughts2')
    hints.addHint(journal.value, 'awakingThoughts3')
    hints.addHint(journal.value, 'awakingThoughts4')

    const getCurrentLocationObj = (title: string): Location | undefined => {
        return locations.value.find(loc=> loc.engName === title)
    }
    watch(() => player.currentLocationTitle, (newTitle: string, oldTitle: string): void => {
        const newLoc = getCurrentLocationObj(newTitle)
        const oldLoc = getCurrentLocationObj(oldTitle)

        if (newLoc) {
            newLoc.isCurrent = true
            notifications.showNotification(newLoc, 'moveLocation')
        }
        if (oldLoc) oldLoc.isCurrent = false
    })

    return {
        player,
        locations,
        notifications,
        windowsVisibility,
        currentLocationObj,
        recipes,
        hints,
        journal,
        getCurrentLocationObj
    } as GameStore
})