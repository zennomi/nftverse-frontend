import { createBrowserRouter } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                lazy: () => import("../pages/Collection")
            },
            {
                path: "/nft",
                lazy: () => import("../pages/Asset")
            },
            {
                path: "/test",
                lazy: () => import("../pages/Test")
            },
        ]
    },
]);

export default router