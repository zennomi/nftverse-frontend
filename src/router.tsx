import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Gallery from "./pages/Gallery";
import NftPage from "./pages/NFT";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Gallery />
            },
            {
                path: "/nft",
                element: <NftPage />
            }
        ]
    },
]);

export default router