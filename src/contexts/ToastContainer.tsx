import { Container, Text } from "@react-three/uikit";
import { Card } from "../components/apfel/card";
import { Fullscreen } from "../components/override/Fullscreen";
import React, { createContext, useContext, useState } from "react";
import { AlertCircle, } from "@react-three/uikit-lucide";
import { useInterval } from "usehooks-ts";

type ToastValueType = {
    toast: (_: ToastConfig) => void,
}

export type ToastConfig = {
    text: string,
    closeAt?: Date,
}

export type Toast = Required<ToastConfig>

export const ToastContext = createContext<ToastValueType>({
    toast: (_: ToastConfig) => { }
});

export const useToastContext = () => useContext(ToastContext)

export default function ToastContainer({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = (newToast: ToastConfig) => {
        if (!newToast.closeAt) {
            newToast.closeAt = new Date(Date.now() + 5 * 1000) // 5 secs
        }
        setToasts(prev => [...prev, newToast as Toast])
    }

    console.log(toasts)

    useInterval(() => {
        setToasts(prev => {
            const newToasts = prev.filter(t => t.closeAt >= new Date())
            return newToasts;
        })
    }, toasts.length > 0 ? 100 : null)

    return (
        <ToastContext.Provider value={{ toast }}>
            <Fullscreen flexDirection="column" justifyContent="flex-end" alignContent="flex-end" alignItems="flex-end" >
                <Container flexGrow={1} width={"100%"} paddingBottom={4} flexDirection="column" justifyContent="flex-end" alignContent="center" alignItems="center" gap={3}>
                    {
                        toasts.map((noti => (
                            <Card padding={4} gap={4} alignItems="center">
                                <AlertCircle />
                                <Text>{noti.text}</Text>
                            </Card>
                        )))
                    }
                </Container>
            </Fullscreen>
            {children}
        </ToastContext.Provider>
    )
}