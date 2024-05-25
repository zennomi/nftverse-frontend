import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import React, { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from "react";

type AppValueType = {
    evnPreset: PresetsType | undefined,
    setEvnPreset: Dispatch<SetStateAction<PresetsType | undefined>>,
}

export const AppContext = createContext<AppValueType>({
    evnPreset: undefined,
    setEvnPreset: () => { }
});

export const useAppContext = () => useContext(AppContext)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [evnPreset, setEvnPreset] = useState<PresetsType>()

    const memoizedValue = useMemo(
        () => ({
            evnPreset,
            setEvnPreset
        }),
        [evnPreset, setEvnPreset,]
    );

    return <AppContext.Provider value={memoizedValue}>{children}</AppContext.Provider>
}