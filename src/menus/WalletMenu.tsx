import { Container, Content, Text } from "@react-three/uikit";
import { Card } from "../components/apfel/card";
import { Input } from "../components/apfel/input";
import { Suspense, useState } from "react";
import { Button } from "../components/apfel/button";
import { Wallet, formatEther, formatUnits } from "ethers"
import { useWalletContext } from "../contexts/WalletProvider";
import { useToastContext } from "../contexts/ToastContainer";
import { AlertTriangle, RefreshCw, Trash, X } from "@react-three/uikit-lucide";
import { Gltf } from "@react-three/drei";
import Numpad from "../components/Numpad";

export default function WalletMenu() {
    const { encryptedData, deceryptPrivateKeys, password, privateKeys, importNewWallet, currentIndex, setCurrentIndex, wallet, balance, assets, removeWallet } = useWalletContext()
    const { toast } = useToastContext()
    const [passwordValue, setPassword] = useState("")
    const [privateKey, setPrivateKey] = useState("")
    const [manageWallet, setManageWallet] = useState(false)

    const submitNewWallet = () => {
        try {
            new Wallet(privateKey)
            setPrivateKey("")
            importNewWallet(privateKey)
        } catch (error) {
            toast({ text: "Invalid private key", variant: "error" })
            console.error(error)
        }
    }

    return (
        <Container flexDirection="column" justifyContent="center" alignItems="center" gap={16}>
            <Suspense>
                <Content width={100}>
                    <group>
                        <Gltf src="/models/Metamask.glb" rotation={[0, Math.PI / 2, 0]} />
                    </group>
                </Content>
            </Suspense>
            <Card width={300} padding={16} flexDirection="column" gap={8} borderRadius={8}>
                {
                    password === "" ?
                        <>
                            <Text textAlign="center" fontWeight={600}>{encryptedData === "" ? "You need to create a password first" : "Welcome back!"}</Text>
                            <Text fontSize={10} textAlign="center">{encryptedData === "" ? "A strong password!" : "The decentralized web awaits"}</Text>
                            <Input type="password" placeholder="Please enter your PIN" value={passwordValue} onValueChange={setPassword} />
                            <Numpad value={passwordValue} onValueChange={setPassword} />
                            <Button size="md" platter onClick={() => {
                                const ok = deceryptPrivateKeys(passwordValue)
                                if (!ok) toast({ text: "Incorrect password", variant: "error" })
                            }
                            }>
                                <Text>{encryptedData === "" ? "Create" : "Unlock"}</Text>
                            </Button>
                        </>
                        :
                        (manageWallet || privateKeys.length === 0 ? <>
                            <Text fontWeight={600} textAlign="center">Sellect an wallet</Text>
                            <Button positionType="absolute" positionRight={5} positionTop={5} size="sm" padding={4} onClick={() => setManageWallet(false)}>
                                <X />
                            </Button>
                            <Container flexDirection="column" gap={8} marginTop={16}>
                                {
                                    privateKeys.length > 0 ? privateKeys.map((key, index) => {
                                        const selected = index === currentIndex
                                        const w = new Wallet(key)
                                        return (
                                            <Container
                                                key={key}
                                                hover={{ backgroundColor: "#BBBBBB", }} backgroundOpacity={0.1} paddingY={8} paddingX={4} borderRadius={4} flexDirection="row" gap={2} backgroundColor={selected ? "#BBBBBB" : undefined}
                                                onClick={() => setCurrentIndex(index)}
                                                width="100%"
                                                overflow="hidden"
                                            >
                                                <Text>{w.address.slice(0, 7)}...{w.address.slice(-6)}</Text>
                                            </Container>
                                        )
                                    }) : <Text textAlign="center">You have not import any wallet yet</Text>
                                }
                            </Container>
                            <Text fontWeight={600} textAlign="center">Or import a new wallet</Text>
                            <Input placeholder="Private key" value={privateKey} onValueChange={setPrivateKey} />
                            <Button size="md" platter onClick={submitNewWallet}><Text>Import</Text></Button>
                            <Container backgroundColor="red" backgroundOpacity={0.5} padding={8} borderRadius={8} flexDirection="row" gap={8}>
                                <AlertTriangle />
                                <Text fontSize={10}>All your private keys are stored at browser local storage</Text>
                            </Container>
                        </>
                            : wallet &&
                            <>
                                <Button platter gap={8} onClick={() => setManageWallet(prev => !prev)}>
                                    <Text fontWeight={700}>{wallet.address.slice(0, 7)}...{wallet.address.slice(-6)}</Text>
                                    <RefreshCw width={16} />
                                </Button>
                                <Text textAlign="center" fontSize={32}>
                                    {formatEther(balance).slice(0, 7)} ETH
                                </Text>
                                <Container flexDirection="column" gapRow={8}>
                                    {
                                        assets.map(asset => (
                                            <Container key={asset.address} backgroundColor="#BBBBBB" backgroundOpacity={0.2} padding={8} borderRadius={8}>
                                                <Container flexDirection="column">
                                                    <Text fontWeight={600}>{asset.name}</Text>
                                                    <Text>{formatUnits(asset.balance, asset.decimals)} ${asset.symbol}</Text>
                                                </Container>
                                            </Container>
                                        ))
                                    }
                                </Container>
                                <Container justifyContent="flex-end">
                                    {privateKeys.length > 1 &&
                                        <Button size="xs" platter gap={4} onClick={() => removeWallet(currentIndex)}>
                                            <Text>Remove</Text>
                                            <Trash width={8} />
                                        </Button>
                                    }
                                </Container>
                            </>
                        )
                }
            </Card>
        </Container>
    )
}