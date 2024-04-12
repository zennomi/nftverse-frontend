import { ReactNode, RefAttributes, forwardRef, useEffect, useMemo } from 'react'
import { batch, signal } from '@preact/signals-core'
import { RootState, createPortal, useStore, useThree } from '@react-three/fiber'
import { EventHandlers } from '@react-three/fiber/dist/declarations/src/core/events.js'
import { FullscreenProperties, RootProperties, updateSizeFullscreen } from '@pmndrs/uikit/internals'
import { ComponentInternals, Root } from '@react-three/uikit'
import { useXR } from '@coconut-xr/natuerlich/react'

export const Fullscreen: (
    props: FullscreenProperties & {
        children?: ReactNode
        attachCamera?: boolean
        distanceToCamera?: number
    } & EventHandlers &
        RefAttributes<ComponentInternals<RootProperties>>,
) => ReactNode = forwardRef((properties, ref) => {
    const store = useStore()
    const [sizeX, sizeY, pixelSize] = useMemo(() => [signal<number>(1), signal<number>(1), signal<number>(1)], [])
    const camera = useThree((s) => s.camera)
    const distanceToCamera = properties.distanceToCamera ?? camera.near + 0.01
    useEffect(() => {
        const fn = ({ camera, size: { height } }: RootState) =>
            batch(() => updateSizeFullscreen(sizeX, sizeY, pixelSize, distanceToCamera, camera, height))
        fn(store.getState())
        return store.subscribe(fn)
    }, [pixelSize, sizeX, sizeY, store, distanceToCamera])

    const attachCamera = useXR.getState().mode === "none" ? (properties.attachCamera ?? true) : false

    return (
        <>
            {attachCamera && <primitive object={camera} />}
            {createPortal(
                <group position-z={-distanceToCamera}>
                    <Root ref={ref} {...properties} sizeX={sizeX} sizeY={sizeY} pixelSize={pixelSize}>
                        {properties.children}
                    </Root>
                </group>,
                camera,
            )}
        </>
    )
})