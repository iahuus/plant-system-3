import ListIcon from "@material-ui/icons/List"
import Plants from "./views/Plants"

export default [
    {
        path: "/plants",
        name: "Plants",
        icon: ListIcon,
        component: Plants,
        layout: "/admin",
    },
]
