import { useThree } from "@react-three/fiber";
import { Container, Root, Text } from "@react-three/uikit";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { Card } from "../components/apfel/card";
import { Columns3, Home, LogIn, LogOut, Package, RefreshCcw, StepBack, SwitchCamera, Wallet, X } from "@react-three/uikit-lucide";
import { Button } from "../components/apfel/button";
import { useEnterXR, useXR } from "@coconut-xr/natuerlich/react";

import { sessionOptions } from "../configs/vr";
import WalletMenu from "./WalletMenu";
import { useWalletContext } from "../contexts/WalletProvider";
import { useNavigate } from "react-router-dom";
import { CartMenu } from "./CartMenu";
import DashboardMenu from "./DashboardMenu";
import { useApolloClient } from "@apollo/client";
import { mutate } from "swr";
import { useToastContext } from "../contexts/ToastContainer";
import { useStore } from "../hooks/store";

const position = new THREE.Vector3()
const direction = new THREE.Vector3()

const HIDE_POSITION = new THREE.Vector3(0, -10, 0)

export default function MainMenu() {
    const camera = useThree(state => state.camera)
    const ref = useRef<THREE.Mesh>(null)
    const { menu, set } = useStore(({ actions, menu, set }) => ({ onToggleMenu: actions.onToggleMenu, menu, set }))
    const onCloseMenu = useCallback(() => {
        set(() => ({ menu: false }))
    }, [set])
    const { wallet } = useWalletContext()
    const [selected, setSelected] = useState("")
    const enterVR = useEnterXR("immersive-vr", sessionOptions);
    const { mode, session } = useXR()
    const navigate = useNavigate()
    const isVR = mode !== "none"
    const exitVR = useCallback(() => {
        session?.end().catch(console.error)
    }, [session])
    const client = useApolloClient()
    const { toast } = useToastContext()

    const refresh = useCallback(async () => {
        mutate(key => typeof key === "string")
        await client.refetchQueries({
            include: "all"
        })
        toast({ text: "Refreshed!", variant: "info" })
    }, [client, mutate])

    useEffect(() => {
        if (!camera || !ref.current) return;
        if (menu) {
            camera.getWorldPosition(position)
            camera.getWorldDirection(direction)
            ref.current.position.copy(position).add(direction.multiplyScalar(0.5))
            ref.current.rotation.copy(camera.rotation)
        } else {
            ref.current.position.copy(HIDE_POSITION)
        }
    }, [menu, camera, ref.current])

    useEffect(() => {
        setSelected("")
    }, [menu])

    return (
        <mesh ref={ref} visible={menu} scale={0.1}>
            <Root>
                <Container flexDirection="column" gap={4}>
                    {
                        selected === "" ?
                            <Card flexDirection="row" justifyContent="space-between" gap={8} padding={16} borderRadius={4} width={400} flexWrap="wrap">
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={() => navigate("/xr/physics/home")}>
                                    <Home height={20} />
                                    <Text>Homepage</Text>
                                </Button>
                                {
                                    wallet &&
                                    <Button flexDirection="column" alignItems="center" justifyContent="center" padding={16} borderRadius={4} borderWidth={1.5} height={80} width={100} gap={4} onClick={() => setSelected("dashboard")}>
                                        <Columns3 height={20} />
                                        <Text>My NFTs</Text>
                                    </Button>
                                }
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={() => setSelected("cart")}>
                                    <Package height={20} />
                                    <Text>Cart</Text>
                                </Button>
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={(onCloseMenu)}>
                                    <X height={20} />
                                    <Text>Close</Text>
                                </Button>
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} width={100} height={80} gap={4} onClick={refresh}>
                                    <RefreshCcw height={20} />
                                    <Text>Refersh</Text>
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
                                <Button flexDirection="column" alignItems="center" padding={16} borderRadius={4} borderWidth={1.5} flexGrow={1} gap={4} height={80} overflow="hidden"
                                    onClick={() => setSelected("wallet")}
                                >
                                    {
                                        wallet ?
                                            <>
                                                <SwitchCamera height={20} />
                                                <Text justifyContent="center">Switch Wallet</Text>
                                                <Text fontSize={14} justifyContent="center" width="100%" textAlign="center">{wallet.address.slice(0, 10)}...{wallet.address.slice(-10)}</Text>
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
                                    : selected === "dashboard" ?
                                        <DashboardMenu />
                                        : <></>
                    }
                    {
                        selected !== "" &&
                        <Container flexDirection="row" gap={8}>
                            <Button platter onClick={() => { setSelected("") }} width="100%"><StepBack height={8} /><Text>Back</Text></Button>
                            <Button platter onClick={onCloseMenu} width="100%"><X height={8} /><Text>Close</Text></Button>
                        </Container>
                    }
                </Container>
            </Root>
        </mesh>
    )
}