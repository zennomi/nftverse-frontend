import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import React, { Dispatch, SetStateAction, createContext, useCallback, useContext, useMemo, useState } from "react";

type AppValueType = {
    openMainMenu: boolean,
    setOpenMainMenu: Dispatch<SetStateAction<boolean>>,
    toggleMainMenu: () => void,
    evnPreset: PresetsType | undefined,
    setEvnPreset: Dispatch<SetStateAction<PresetsType | undefined>>,
}

export const AppContext = createContext<AppValueType>({
    openMainMenu: false,
    setOpenMainMenu: () => { },
    toggleMainMenu: () => { },
    evnPreset: undefined,
    setEvnPreset: () => { }
});

export const useAppContext = () => useContext(AppContext)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [openMainMenu, setOpenMainMenu] = useState(false)
    const [evnPreset, setEvnPreset] = useState<PresetsType>()

    const toggleMainMenu = useCallback(() => {
        setOpenMainMenu(prev => !prev)
    }, [setOpenMainMenu])

    const memoizedValue = useMemo(
        () => ({
            openMainMenu,
            setOpenMainMenu,
            toggleMainMenu,
            evnPreset,
            setEvnPreset
        }),
        [openMainMenu, toggleMainMenu, evnPreset, setEvnPreset, setOpenMainMenu]
    );

    return <AppContext.Provider value={memoizedValue}>{children}</AppContext.Provider>
}