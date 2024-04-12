import React, { Dispatch, SetStateAction, createContext, useCallback, useContext, useMemo, useState } from "react";
import { AES, enc } from "crypto-js";
import { useLocalStorage } from 'usehooks-ts';
import { Wallet } from "ethers";

const WALLET_DATA_KEY = "wallet-data"

type WalletValueType = {
    privateKeys: string[],
    encryptedData: string,
    password: string,
    deceryptPrivateKeys: (pw: string) => boolean,
    importNewWallet: (pw: string) => void,
    currentIndex: number,
    setCurrentIndex: Dispatch<SetStateAction<number>>,
}

export const WalletContext = createContext<WalletValueType>({
    privateKeys: [],
    encryptedData: "",
    password: "",
    deceryptPrivateKeys: (_: string) => false,
    importNewWallet: (_: string) => { },
    currentIndex: -1,
    setCurrentIndex: () => { }
});

export const useWalletContext = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [privateKeys, setPrivateKeys] = useState<string[]>([])
    const [encryptedData, setEncryptedData] = useLocalStorage(WALLET_DATA_KEY, "")
    const [password, setPassword] = useState("")
    const [currentIndex, setCurrentIndex] = useState(-1)

    const deceryptPrivateKeys = useCallback((_password: string) => {
        if (!encryptedData) {
            setPassword(_password)
            return true;
        }
        try {
            const bytes = AES.decrypt(encryptedData, _password)
            const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
            if (decryptedData instanceof Array) {
                setPrivateKeys(decryptedData)
                setPassword(_password)
                setCurrentIndex(0)
                return true
            }
        } catch (error) {
        }
        setPassword("")
        return false
    }, [encryptedData, setPassword])

    const importNewWallet = useCallback((privateKey: string) => {
        new Wallet(privateKey)
        if (privateKeys.includes(privateKey)) return;
        const newPrivateKeys = [...privateKeys, privateKey]
        const newEncryptedData = AES.encrypt(JSON.stringify(newPrivateKeys), password).toString()
        setPrivateKeys(newPrivateKeys)
        setEncryptedData(newEncryptedData)
        setCurrentIndex(newPrivateKeys.length - 1)
    }, [privateKeys, password])

    const memoizedValue = useMemo(
        () => ({
            privateKeys,
            encryptedData,
            deceryptPrivateKeys,
            password,
            importNewWallet,
            currentIndex,
            setCurrentIndex,
        }),
        [privateKeys, encryptedData, deceryptPrivateKeys, password, importNewWallet, currentIndex, setCurrentIndex]
    );

    // init loader
    // useEffect(() => {
    //     const private
    // }, [])

    return <WalletContext.Provider value={memoizedValue}>{children}</WalletContext.Provider>
}