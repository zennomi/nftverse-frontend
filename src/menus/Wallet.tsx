import { Container, Text } from "@react-three/uikit";
import { Card } from "../components/apfel/card";
import { Input } from "../components/apfel/input";
import { useState } from "react";
import { Button } from "../components/apfel/button";
import { Wallet } from "ethers"
import { useWalletContext } from "../contexts/WalletProvider";
import { useToastContext } from "../contexts/ToastContainer";
import { AlertTriangle } from "@react-three/uikit-lucide";

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
        <Card width={300} padding={16} flexDirection="column" gap={8} borderRadius={8}>
            {
                password === "" ?
                    <>
                        <Text>{encryptedData === "" ? "You need to create a password first" : "Enter your password"}</Text>
                        <Input placeholder="Please enter your password" value={passwordValue} onValueChange={setPassword} />
                        <Button size="md" platter onClick={() => {
                            const ok = deceryptPrivateKeys(passwordValue)
                            if (!ok) toast({ text: "Incorrect password" })
                        }
                        }>
                            <Text>Submit</Text>
                        </Button>
                    </>
                    :
                    <>
                        <Text fontWeight={700}>Your wallets</Text>
                        {
                            privateKeys.length > 0 ? privateKeys.map((key, index) => (
                                <Container
                                    key={key}
                                    hover={{ backgroundColor: "#BBBBBB", }} padding={2} borderRadius={4} flexDirection="row" gap={2} backgroundColor={index === currentIndex ? "#BBBBBB" : undefined}
                                    onClick={() => setCurrentIndex(index)}
                                    width="100%"
                                    overflow="hidden"
                                >
                                    <Text>{new Wallet(key).address}</Text>
                                </Container>
                            )) : <Text>You need import new wallet</Text>
                        }
                        <Input placeholder="Private key" value={privateKey} onValueChange={setPrivateKey} />
                        <Button size="md" platter onClick={submitNewWallet}><Text>Import new wallet</Text></Button>
                        <Container backgroundColor="red" backgroundOpacity={0.5} padding={4} borderRadius={4} flexDirection="row" gap={4}>
                            <AlertTriangle />
                            <Text fontSize={10}>Your private keys are stored at browser localstorage</Text>
                        </Container>
                    </>
            }
        </Card>
    )
}