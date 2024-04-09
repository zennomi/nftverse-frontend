import { createBrowserRouter } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                lazy: () => import("./pages/Gallery")
            },
            {
                path: "/nft",
                lazy: () => import("./pages/NFT")
            },
            {
                path: "/test",
                lazy: () => import("./pages/Test")
            },
        ]
    },
]);

export default router