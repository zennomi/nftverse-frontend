import { Container, Text } from "@react-three/uikit";
import { Card } from "../components/apfel/card";
import { Input } from "../components/apfel/input";
import { useState } from "react";
import { Button } from "../components/apfel/button";
import { Wallet } from "ethers"
import { useWalletContext } from "../contexts/WalletProvider";
import { useToastContext } from "../contexts/ToastContainer";

export default function WalletMenu() {
    const { encryptedData, deceryptPrivateKeys, password, privateKeys, importNewWallet, currentIndex, setCurrentIndex } = useWalletContext()
    const { toast } = useToastContext()
    const [passwordValue, setPassword] = useState("")
    const [privateKey, setPrivateKey] = useState("")

    const submitNewWallet = () => {
        try {
            new Wallet(privateKey)
            setPrivateKey("")
            importNewWallet(privateKey)
        } catch (error) {
            toast({ text: "Invalid private key" })
            console.error(error)
        }
    }

    return (
        <Card padding={4} flexDirection="column" gap={4} borderRadius={4}>
            {
                password === "" ?
                    <>
                        <Text fontSize={8}>{encryptedData === "" ? "You need to create a password first" : "Enter your password"}</Text>
                        <Input fontSize={8} placeholder="Please enter your password" value={passwordValue} onValueChange={setPassword} />
                        <Button size="xs" platter onClick={() => {
                            const ok = deceryptPrivateKeys(passwordValue)
                            if (!ok) toast({ text: "Incorrect password" })
                        }
                        }>
                            <Text fontSize={8}>Submit</Text>
                        </Button>
                    </>
                    :
                    <>
                        <Text fontSize={8}>Your wallets</Text>
                        {
                            privateKeys.length > 0 ? privateKeys.map((key, index) => (
                                <Container
                                    hover={{ backgroundColor: "#BBBBBB", }} padding={1} borderRadius={1} flexDirection="row" gap={2} backgroundColor={index === currentIndex ? "#BBBBBB" : undefined}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <Text fontSize={6}>{new Wallet(key).address}</Text>
                                </Container>
                            )) : <Text fontSize={6}>You need import new wallet</Text>
                        }
                        <Input fontSize={6} placeholder="Private key" value={privateKey} onValueChange={setPrivateKey} />
                        <Button size="xs" platter onClick={submitNewWallet}><Text fontSize={6}>Import new wallet</Text></Button>
                        <Container backgroundColor="red" backgroundOpacity={0.5} padding={2} borderRadius={2}>
                            <Text fontSize={6}>Your private keys are stored at browser localstorage</Text>
                        </Container>
                    </>
            }
        </Card>
    )
}