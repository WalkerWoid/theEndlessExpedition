import {defineStore} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import type {Ref} from "vue";
import type {ComputedRef} from "vue";

import type {Notifications} from "@/classes/notifications.ts";
import type {Player} from "@/classes/player.ts";
import type {Location} from "@/classes/allLocations.ts";
import type {WindowsVisibility} from "@/classes/windowsVisibility.ts";
import type {AllRecipes} from "@/classes/allRecipes.ts";

import {playerObj} from "@/classes/player.ts";
import {allLocations} from "@/classes/allLocations.ts";
import {notificationsObj} from "@/classes/notifications.ts";
import {windowsVisibilityObj} from "@/classes/windowsVisibility.ts";
import {allRecipes} from "@/classes/allRecipes.ts";

export interface GameStore {
    player: Player
    locations: Ref<Location[]>
    notifications: Notifications
    windowsVisibility: WindowsVisibility
    currentLocationObj: ComputedRef<Location | undefined>
    recipes: AllRecipes
    getCurrentLocationObj(title: string): Location
}

export const useGameStore = defineStore('gameStore', () => {
    const player = reactive(playerObj)
    const locations = ref(allLocations)
    const notifications = reactive(notificationsObj)
    const windowsVisibility = reactive(windowsVisibilityObj)
    const recipes = reactive(allRecipes)

    const currentLocationObj = computed<Location | undefined>(() => {
        return getCurrentLocationObj(player.currentLocationTitle)
    })

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
        getCurrentLocationObj
    } as GameStore
})