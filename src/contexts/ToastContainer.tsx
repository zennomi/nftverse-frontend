import { Container, Text } from "@react-three/uikit";
import { Fullscreen } from "../components/override/Fullscreen";
import React, { createContext, useContext, useState } from "react";
import { AlertCircle, Ban, CheckCircle2, } from "@react-three/uikit-lucide";
import { useInterval } from "usehooks-ts";
import { v4 as uuidv4 } from 'uuid';

type ToastValueType = {
    toast: (_: ToastConfig) => void,
}

export type ToastVariant = "success" | "error" | "info" | "warning"

export type ToastConfig = {
    text: string,
    closeAt?: Date,
    variant?: ToastVariant
}

const variants: Record<ToastVariant, any> = {
    success: {
        backgroundColor: "#F4FFF8",
        icon: <CheckCircle2 color="#6FCF97" />,
        textColor: "#4D4D4D",
    },
    error: {
        backgroundColor: "#EB5757",
        icon: <Ban color="white" />,
        textColor: "white",
    },
    info: {
        backgroundColor: "#329ABB",
        icon: <AlertCircle color="white" />,
        textColor: "white",
    },
    warning: {
        backgroundColor: "#F2C94C",
        icon: <AlertCircle color="#6E5404" />,
        textColor: "#6E5404",
    },
}

export type Toast = Required<ToastConfig> & { id: string }

export const ToastContext = createContext<ToastValueType>({
    toast: (_: ToastConfig) => { }
});

export const useToastContext = () => useContext(ToastContext)

export default function ToastContainer({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = (newToastConfig: ToastConfig) => {
        if (!newToastConfig.closeAt) {
            newToastConfig.closeAt = new Date(Date.now() + 5 * 1000) // 5 secs
        }
        if (!newToastConfig.variant) {
            newToastConfig.variant = "info"
        }

        const newToast = { ...newToastConfig, id: uuidv4() }
        setToasts(prev => [...prev, newToast as Toast])
    }

    useInterval(() => {
        setToasts(prev => {
            const newToasts = prev.filter(t => t.closeAt >= new Date())
            return newToasts;
        })
    }, toasts.length > 0 ? 100 : null)

    return (
        <ToastContext.Provider value={{ toast }}>
            <Fullscreen flexDirection="column" justifyContent="flex-end" alignContent="center" alignItems="center" distanceToCamera={0.5} paddingBottom={80}>
                <Container flexGrow={1} width={300} paddingBottom={4} flexDirection="column" justifyContent="flex-end" alignContent="center" alignItems="center" gap={3}>
                    {
                        toasts.map((noti => {
                            const variant = variants[noti.variant]
                            return (
                                <Container key={noti.id} backgroundColor={variant.backgroundColor} padding={8} borderRadius={8} borderBend={4} gap={8} alignItems="center" alignContent="center">
                                    {variant.icon}
                                    <Container flexDirection="column">
                                        <Text fontWeight={500} color={variant.textColor}>{noti.text}</Text>
                                    </Container>
                                </Container>
                            )
                        }))
                    }
                </Container>
            </Fullscreen>
            {children}
        </ToastContext.Provider>
    )
}