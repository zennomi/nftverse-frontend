import { createBrowserRouter } from "react-router-dom";
import XRLayout from "../layouts/XRLayout";

const router = createBrowserRouter([
    {
        path: "/xr",
        element: <XRLayout />,
        children: [
            {
                path: "/xr/home",
                lazy: () => import("../pages/Home")
            },
            {
                path: "/xr/collection",
                lazy: () => import("../pages/Collection")
            },
            {
                path: "/xr/nft",
                lazy: () => import("../pages/Asset")
            },
        ]
    },
    {
        path: "/test",
        lazy: () => import("../pages/Test")
    },
]);

export default router