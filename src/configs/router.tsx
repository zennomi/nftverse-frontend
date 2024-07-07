import { Navigate, createBrowserRouter } from "react-router-dom";
import XRLayout from "../layouts/XRLayout";
import PhysicsLayout from "../layouts/Physics";

export const paths = {
    nft: (id: string) => `/xr/physics/token/futuristic/${id}`
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/xr/physics/home" />
    },
    {
        path: "/test2",
        lazy: () => import("../pages/Test2")
    },
    {
        path: "/xr",
        element: <XRLayout />,
        children: [
            {
                path: "/xr/test",
                lazy: () => import("../pages/Test")
            },
            {
                path: "/xr/physics",
                element: <PhysicsLayout />,
                children: [
                    {
                        path: "/xr/physics/home",
                        lazy: () => import("../pages/Home"),
                    },
                    {
                        path: "/xr/physics/collection/futuristic",
                        lazy: () => import("../pages/Collection/FuturisticCollection")
                    },
                    {
                        path: "/xr/physics/collection/pfp_model",
                        lazy: () => import("../pages/Collection/PfpModelCollection")
                    },
                    {
                        path: "/xr/physics/collection/car",
                        lazy: () => import("../pages/Collection/CarCollection")
                    },
                    {
                        path: paths.nft(":id"),
                        lazy: () => import("../pages/Token/ScifiToken")
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