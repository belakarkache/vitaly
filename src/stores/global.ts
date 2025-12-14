import { defineStore } from 'pinia'

type UserInformation = {
  age: number
  weight: number | null
  height: number | null
  biologicalSex: string | null
  activityLevel: string | null
  goal: string | null
}

type GlobalState = {
  userInformation: UserInformation
  dailyGoal: number
  weightGoal: number | null
  weightHistory: WeightHistoryEntry[]
}

type WeightHistoryEntry = {
  date: string
  weight: number
}

type PersistedKeys = keyof GlobalState

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    userInformation: localStorage.getItem('userInformation')
      ? JSON.parse(localStorage.getItem('userInformation')!)
      : {
          age: 18,
          weight: null,
          height: null,
          biologicalSex: null,
          activityLevel: null,
          goal: null,
        },
    dailyGoal: localStorage.getItem('dailyGoal')
      ? JSON.parse(localStorage.getItem('dailyGoal')!)
      : 2000,
    weightGoal: localStorage.getItem('weightGoal')
      ? JSON.parse(localStorage.getItem('weightGoal')!)
      : null,
    weightHistory: localStorage.getItem('weightHistory')
      ? JSON.parse(localStorage.getItem('weightHistory')!)
      : ([] as WeightHistoryEntry[]),
  }),

  actions: {
    updateStoreAndStorage<K extends PersistedKeys>(key: K, value: GlobalState[K]) {
      this.$state[key] = value as GlobalState[K]
      localStorage.setItem(key, JSON.stringify(value))
    },
  },
})
