import { RatioImage } from "../RatioImage"
import NFT from "../NFT";

export function Component() {

    return (
        <>
            <ambientLight intensity={10} position={[0, 0.85, 0]} />
            <directionalLight intensity={10} position={[1, 1, 1]} />
            <RatioImage url="https://i.imgur.com/MVZJ0Bw.jpeg" />
            <NFT information={{ name: "Mie Ai", description: "Ai is an absentminded person who often forgets to bring her glasses", url: "https://i.imgur.com/iAVxywl.png" }} position={[0, 2.38, -2.94]} scale={1.2} />
        </>
    )
}