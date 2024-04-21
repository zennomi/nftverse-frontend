import { createBrowserRouter } from "react-router-dom";
import XRLayout from "../layouts/XRLayout";
import PhysicsLayout from "../layouts/Physics";

const router = createBrowserRouter([
    {
        path: "/test2",
        lazy: () => import("../pages/Test2")
    },
    {
        path: "/xr",
        element: <XRLayout />,
        children: [
            {
                path: "/xr/home",
                lazy: () => import("../pages/Home"),
            },
            {
                path: "/xr/test",
                lazy: () => import("../pages/Test")
            },
            {
                path: "/xr/physics",
                element: <PhysicsLayout />,
                children: [
                    {
                        path: "/xr/physics/collection",
                        lazy: () => import("../pages/Collection")
                    },
                    {
                        path: "/xr/physics/nft",
                        lazy: () => import("../pages/Asset")
                    },
                ]
            },

        ]
    },

]);

export default router