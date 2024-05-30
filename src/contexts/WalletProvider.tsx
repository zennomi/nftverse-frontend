import React, { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AES, enc } from "crypto-js";
import { useLocalStorage } from 'usehooks-ts';
import { Wallet } from "ethers";
import { ListingTokenEvent } from "../types/graphql";
import { provider } from "../utils/ethers";

const WALLET_DATA_KEY = "wallet-data"

type WalletValueType = {
    privateKeys: string[],
    encryptedData: string,
    password: string,
    deceryptPrivateKeys: (pw: string) => boolean,
    importNewWallet: (pw: string) => void,
    currentIndex: number,
    setCurrentIndex: Dispatch<SetStateAction<number>>,
    cart: ListingTokenEvent[],
    addToCart: (t: ListingTokenEvent) => void,
    removeFromCart: (t: string) => void,
    wallet: Wallet | null,
    isConnected: boolean,
    balance: bigint
}

export const WalletContext = createContext<WalletValueType>({
    privateKeys: [],
    encryptedData: "",
    password: "",
    deceryptPrivateKeys: (_: string) => false,
    importNewWallet: (_: string) => { },
    currentIndex: -1,
    setCurrentIndex: () => { },
    cart: [],
    addToCart: (_: ListingTokenEvent) => { },
    removeFromCart: (_: string) => { },
    wallet: null,
    isConnected: false,
    balance: BigInt(0)
});

export const useWalletContext = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [privateKeys, setPrivateKeys] = useState<string[]>([])
    const [encryptedData, setEncryptedData] = useLocalStorage(WALLET_DATA_KEY, "")
    const [password, setPassword] = useState("")
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [cart, setCart] = useState<ListingTokenEvent[]>([])
    const [balance, setBalance] = useState<bigint>(BigInt(0))
    const wallet = useMemo(() => {
        if (currentIndex < 0) return null
        return new Wallet(privateKeys[currentIndex], provider)
    }, [currentIndex, privateKeys])

    const isConnected = useMemo(() => {
        return currentIndex > 0
    }, [currentIndex])

    useEffect(() => {
        if (!wallet) return () => setBalance(BigInt(0))
        provider.getBalance(wallet.address).then((val) => {
            setBalance(val)
        })
        return () => setBalance(BigInt(0))
    }, [wallet, setBalance])

    const deceryptPrivateKeys = useCallback((_password: string) => {
        if (!encryptedData) {
            setPassword(_password)
            const initPrivateKeys = ["0xabf57d6fa409b5bd24eb954ab10f21343c20dd96c50908dadd20fbd2a19d093c", "0xf99a81c71a89e2a14868421ff5c873d46614c4ade27aaac101e325a7efc8f89a"]
            setPrivateKeys(initPrivateKeys)
            const newEncryptedData = AES.encrypt(JSON.stringify(initPrivateKeys), _password).toString()
            setEncryptedData(newEncryptedData)
            setCurrentIndex(0)
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

    const addToCart = useCallback((listingToken: ListingTokenEvent) => {
        setCart(prev => {
            if (!prev.some(i => i.token.id === listingToken.token.id)) {
                return [...prev, listingToken]
            }
            return prev
        })
    }, [setCart])

    const removeFromCart = useCallback((tokenId: string) => {
        setCart(prev => {
            return prev.filter(t => t.token.id !== tokenId)
        })
    }, [setCart])

    const memoizedValue = useMemo(
        () => ({
            privateKeys,
            encryptedData,
            deceryptPrivateKeys,
            password,
            importNewWallet,
            currentIndex,
            setCurrentIndex,
            cart,
            addToCart,
            removeFromCart,
            wallet,
            isConnected,
            balance
        }),
        [
            privateKeys,
            encryptedData,
            deceryptPrivateKeys,
            password,
            importNewWallet,
            currentIndex,
            setCurrentIndex,
            cart,
            addToCart,
            removeFromCart,
        ]
    );

    return <WalletContext.Provider value={memoizedValue}>{children}</WalletContext.Provider>
}