import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useAppContext } from "../contexts/AppProvider";
import { Card } from "../components/apfel/card";
import { Columns3, Home, LogIn, LogOut, Package, StepBack, SwitchCamera, Wallet, X } from "@react-three/uikit-lucide";
import { Button } from "../components/apfel/button";
import { useEnterXR, useXR } from "@coconut-xr/natuerlich/react";
import { Wallet as EthersWallet } from "ethers"

import { sessionOptions } from "../configs/vr";
import WalletMenu from "./Wallet";
import { useWalletContext } from "../contexts/WalletProvider";
import { useNavigate } from "react-router-dom";
import { CartMenu } from "./CartMenu";

const position = new THREE.Vector3()
const direction = new THREE.Vector3()

const HIDE_POSITION = new THREE.Vector3(0, -10, 0)

export default function MainMenu() {
    const camera = useThree(state => state.camera)
    const ref = useRef<THREE.Mesh>(null)
    const { openMainMenu, toggleMainMenu } = useAppContext()
    const { privateKeys, currentIndex } = useWalletContext()
    const [selected, setSelected] = useState("")
    const enterVR = useEnterXR("immersive-vr", sessionOptions);
    const { mode, session } = useXR()
    const navigate = useNavigate()
    const isVR = mode !== "none"
    const exitVR = useCallback(() => {
        session?.end().catch(console.error)
    }, [session])

    useEffect(() => {
        if (!camera || !ref.current) return;
        if (openMainMenu) {
            camera.getWorldPosition(position)
            camera.getWorldDirection(direction)
            ref.current.position.copy(position).add(direction.multiplyScalar(0.5))
            ref.current.rotation.copy(camera.rotation)
        } else {
            ref.current.position.copy(HIDE_POSITION)
        }
    }, [openMainMenu, camera, ref.current])

    return (
        <mesh ref={ref} visible={openMainMenu} scale={0.1}>
            <Root>
                <Container flexDirection="column" gap={4}>
                    {
                        selected === "" ?
                            <Card flexDirection="row" justifyContent="space-between" gap={8} padding={16} borderRadius={4} width={500} flexWrap="wrap">
                                <Button flexDirection="column" alignItems="center" justifyContent="center" padding={16} borderRadius={4} borderWidth={1.5} height={80} width={100} gap={4}>
                                    <Columns3 height={20} />
                                    <Text>Collections</Text>
                                </Button>
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={() => navigate("/xr/physics/home")}>
                                    <Home height={20} />
                                    <Text>Dashboard</Text>
                                </Button>
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={() => setSelected("cart")}>
                                    <Package height={20} />
                                    <Text>Cart</Text>
                                </Button>
                                {
                                    isVR ?
                                        <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={() => exitVR()}>
                                            <LogOut height={20} />
                                            <Text justifyContent="center">Exit VR</Text>
                                        </Button>
                                        :
                                        <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={() => enterVR()}>
                                            <LogIn height={20} />
                                            <Text justifyContent="center">Enter VR</Text>
                                        </Button>
                                }
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} flexGrow={1} gap={4} height={80}
                                    onClick={() => setSelected("wallet")}
                                >
                                    {
                                        !!privateKeys[currentIndex] ?
                                            <>
                                                <SwitchCamera height={20} />
                                                <Text justifyContent="center">Switch Wallet</Text>
                                                <Text fontSize={14} justifyContent="center">{new EthersWallet(privateKeys[currentIndex]).address}</Text>
                                            </> : <>
                                                <Wallet height={20} />
                                                <Text justifyContent="center">Connect Wallet</Text>
                                            </>
                                    }
                                </Button>
                            </Card>
                            : selected === "wallet" ?
                                <WalletMenu />
                                :
                                selected === "cart" ?
                                    <CartMenu />
                                    :
                                    <></>
                    }
                    {
                        selected !== "" &&
                        <Container flexDirection="row" gap={8}>
                            <Button platter onClick={() => { setSelected("") }} width="100%"><StepBack height={8} /><Text>Back</Text></Button>
                            <Button platter onClick={toggleMainMenu} width="100%"><X height={8} /><Text>Close</Text></Button>
                        </Container>
                    }
                </Container>
            </Root>
        </mesh>
    )
}