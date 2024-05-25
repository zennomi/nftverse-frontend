import { useEffect } from 'react'
import { useStore } from '../hooks/store'

interface KeyConfig extends KeyMap {
    keys?: string[]
}

interface KeyMap {
    fn: (pressed: boolean) => void
    up?: boolean
    pressed?: boolean
}

function useKeys(keyConfig: KeyConfig[]) {
    useEffect(() => {
        const keyMap = keyConfig.reduce<{ [key: string]: KeyMap }>((out, { keys, fn, up = true }) => {
            keys && keys.forEach((key) => (out[key] = { fn, pressed: false, up }))
            return out
        }, {})

        const downHandler = ({ key, target }: KeyboardEvent) => {
            if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return
            const { fn, pressed, up } = keyMap[key]
            keyMap[key].pressed = true
            if (up || !pressed) fn(true)
        }

        const upHandler = ({ key, target }: KeyboardEvent) => {
            if (!keyMap[key] || (target as HTMLElement).nodeName === 'INPUT') return
            const { fn, up } = keyMap[key]
            keyMap[key].pressed = false
            if (up) fn(false)
        }

        window.addEventListener('keydown', downHandler, { passive: true })
        window.addEventListener('keyup', upHandler, { passive: true })

        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)
        }
    }, [keyConfig])
}

export function Keyboard() {
    const { set } = useStore(({ set }) => ({ set }))
    useKeys([
        { keys: ['ArrowUp', 'w', 'W'], fn: (forward) => set((state) => ({ controls: { ...state.controls, forward: forward ? 1 : 0 } })) },
        { keys: ['ArrowDown', 's', 'S'], fn: (backward) => set((state) => ({ controls: { ...state.controls, backward: backward ? 1 : 0 } })) },
        { keys: ['ArrowLeft', 'a', 'A'], fn: (left) => set((state) => ({ controls: { ...state.controls, left: left ? 1 : 0 } })) },
        { keys: ['ArrowRight', 'd', 'D'], fn: (right) => set((state) => ({ controls: { ...state.controls, right: right ? 1 : 0 } })) },
        { keys: ['Shift'], fn: (boost) => set((state) => ({ controls: { ...state.controls, boost: boost ? 1 : 0 } })) },
        { keys: ['j', 'J'], fn: (jump) => set((state) => ({ controls: { ...state.controls, jump: jump ? 1 : 0 } })) },
        { keys: ['m', 'M'], fn: () => set((state) => ({ menu: !state.menu })), up: false },
        { keys: ['n', 'N'], fn: () => set((state) => ({ navigator: !state.navigator })), up: false },
        { keys: ['Esc'], fn: () => set(() => ({ menu: false, navigator: false, })), up: false },
    ])
    return null
}
