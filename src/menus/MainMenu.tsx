import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useAppContext } from "../contexts/AppProvider";
import { Card } from "../components/apfel/card";
import { Columns3, Home, LogIn, LogOut, StepBack, SwitchCamera, Wallet } from "@react-three/uikit-lucide";
import { Button } from "../components/apfel/button";
import { useEnterXR, useXR } from "@coconut-xr/natuerlich/react";
import { Wallet as EthersWallet } from "ethers"

import { sessionOptions } from "../configs/vr";
import WalletMenu from "./Wallet";
import { useWalletContext } from "../contexts/WalletProvider";

const position = new THREE.Vector3()
const direction = new THREE.Vector3()

export default function MainMenu() {
    const camera = useThree(state => state.camera)
    const ref = useRef<THREE.Mesh>(null)
    const { openMainMenu } = useAppContext()
    const { privateKeys, currentIndex } = useWalletContext()
    const [selected, setSelected] = useState("")
    const enterVR = useEnterXR("immersive-vr", sessionOptions);
    const { mode, session } = useXR()
    const isVR = mode !== "none"
    const exitVR = useCallback(() => {
        session?.end().catch(console.error)
    }, [session])

    useEffect(() => {
        if (openMainMenu && camera && ref.current) {
            camera.getWorldPosition(position)
            camera.getWorldDirection(direction)
            ref.current.position.copy(position).add(direction.multiplyScalar(2))
            ref.current.rotation.copy(camera.rotation)
        }
    }, [openMainMenu, camera, ref.current])

    return (
        <mesh ref={ref} visible={openMainMenu}>
            <Root>
                <Container flexDirection="column" gap={4}>
                    {
                        selected === "" ?
                            <Card flexDirection="row" justifyContent="space-between" gap={4} padding={8} borderRadius={4} width={200} flexWrap="wrap">
                                <Button flexDirection="column" alignItems="center" padding={4} borderRadius={4} border={1} width={50} gap={4}>
                                    <Columns3 height={10} />
                                    <Text fontSize={8}>Collections</Text>
                                </Button>
                                <Button flexDirection="column" alignItems="center" padding={4} borderRadius={4} border={1} width={50} gap={4}>
                                    <Home height={10} />
                                    <Text fontSize={8}>Dashboard</Text>
                                </Button>
                                {
                                    isVR ?
                                        <Button flexDirection="column" alignItems="center" padding={4} borderRadius={4} border={1} width={50} gap={4} onClick={() => exitVR()}>
                                            <LogOut height={10} />
                                            <Text fontSize={8} justifyContent="center">Exit VR</Text>
                                        </Button>
                                        :
                                        <Button flexDirection="column" alignItems="center" padding={4} borderRadius={4} border={1} width={50} gap={4} onClick={() => enterVR()}>
                                            <LogIn height={10} />
                                            <Text fontSize={8} justifyContent="center">Enter VR</Text>
                                        </Button>
                                }
                                <Button flexDirection="column" alignItems="center" padding={4} borderRadius={4} border={1} flexGrow={1} gap={4}
                                    onClick={() => setSelected("wallet")}
                                >
                                    {
                                        !!privateKeys[currentIndex] ?
                                            <>
                                                <SwitchCamera height={10} />
                                                <Text fontSize={8} justifyContent="center">Switch Wallet</Text>
                                                <Text fontSize={6} justifyContent="center">{new EthersWallet(privateKeys[currentIndex]).address}</Text>
                                            </> : <>
                                                <Wallet height={10} />
                                                <Text fontSize={8} justifyContent="center">Connect Wallet</Text>
                                            </>
                                    }
                                </Button>
                            </Card>
                            : selected === "wallet" ?
                                <WalletMenu />
                                : <></>
                    }
                    {
                        selected !== "" &&
                        <Button size="xs" platter onClick={() => { setSelected("") }}><StepBack width={10} /><Text>Back</Text></Button>
                    }
                </Container>
            </Root>
        </mesh>
    )
}