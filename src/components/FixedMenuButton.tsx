import { useStore } from "../hooks/store"

export default function FixedMenuButton() {
    const onToggleMenu = useStore(state => state.actions.onToggleMenu)
    return (
        <button className="enter-vr-button" onClick={onToggleMenu}>Open Menu</button>
    )
}