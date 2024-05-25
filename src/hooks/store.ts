import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

import type { GetState, SetState, StateSelector } from 'zustand'

const controls = {
    backward: 0,
    boost: 0,
    forward: 0,
    left: 0,
    right: 0,
    jump: 0,
}

const booleans = ['menu', 'navigator', 'stats'] as const

type Booleans = typeof booleans[number]

type BaseState = {
    [K in Booleans]: boolean
}

const actionNames = ['onToggleMenu', 'onToggleNavigator'] as const
export type ActionNames = typeof actionNames[number]

export type Controls = typeof controls

type Getter = GetState<IState>
export type Setter = SetState<IState>

export interface IState extends BaseState {
    actions: Record<ActionNames, () => void>
    controls: Controls
    get: Getter
    set: Setter
}

const useStoreImpl = create<IState>((set: SetState<IState>, get: GetState<IState>) => {
    const actions = {
        onToggleMenu: () => {
            set(state => ({ ...state, menu: !state.menu }))
        },
        onToggleNavigator: () => {
            set(state => ({ ...state, navigator: !state.navigator }))
        },
    }
    return {
        actions,
        controls,
        get,
        set,
        stats: false,
        menu: false,
        navigator: false,
    }
})

// Make the store shallow compare by default
const useStore = <T>(sel: StateSelector<IState, T>) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState, useStore }