import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Root, Text } from "@react-three/uikit";
import { useKeyboardControls } from "@react-three/drei";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "./default/pagination";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./default/card";

const position = new THREE.Vector3()
const direction = new THREE.Vector3()

const HIDE_POSITION = new THREE.Vector3(0, -10, 0)

export default function Navigator({ page, setPage, maxPage, children }: { children?: ReactNode, page: number, maxPage: number, setPage: Dispatch<SetStateAction<number>> }) {
    const [open, setOpen] = useState<boolean>(false)
    const camera = useThree(state => state.camera)
    const ref = useRef<THREE.Mesh>(null)
    const [sub,] = useKeyboardControls()

    useEffect(() => {
        return sub(
            (state) => state.navigator,
            (pressed) => {
                if (pressed) {
                    setOpen(prev => !prev)
                }
            }
        )
    }, [])

    useEffect(() => {
        return sub(
            (state) => state.esc,
            (pressed) => {
                if (pressed) {
                    setOpen(false)
                }
            }
        )
    }, [])

    useEffect(() => {
        if (!camera || !ref.current) return;
        if (open) {
            camera.getWorldPosition(position)
            camera.getWorldDirection(direction)
            ref.current.position.copy(position).add(direction.multiplyScalar(1))
            ref.current.rotation.copy(camera.rotation)
        } else {
            ref.current.position.copy(HIDE_POSITION)
        }
    }, [open, camera, ref.current])

    return (
        <mesh ref={ref} visible={open} scale={0.3}>
            <Root>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Text>Navigator</Text>
                        </CardTitle>
                    </CardHeader>
                    {children &&
                        <CardContent>{children}</CardContent>
                    }
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {
                                    page > 1 &&
                                    <PaginationItem onClick={() => setPage(page - 1)}>
                                        <PaginationPrevious />
                                    </PaginationItem>
                                }
                                {
                                    [...Array(maxPage)].map((_, index) => {
                                        if ((index + 1 >= page + 2 || index + 1 <= page - 2)) return <></>
                                        return (
                                            <PaginationItem key={index} onClick={() => setPage(index + 1)}>
                                                <PaginationLink isActive={index + 1 === page}>
                                                    <Text>{(index + 1).toString()}</Text>
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })
                                }
                                {
                                    page < maxPage &&
                                    <PaginationItem onClick={() => setPage(page + 1)} >
                                        <PaginationNext />
                                    </PaginationItem>
                                }
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </Root>
        </mesh>
    )
}