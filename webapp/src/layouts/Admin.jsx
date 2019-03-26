import React from "react"
import { Switch, Route } from "react-router-dom"
import routes from "../routes"
import Drawer from "../components/Drawer"
import logo from "../assets/img/plant_logo.png"

class Admin extends React.Component {
    constructor(props) {
        super(props)
    }

    getActiveRoute = routes => {
        let activeRoute = "Default Brand Text"
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = this.getActiveRoute(routes[i].views)
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute
                }
            } else {
                if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                    return routes[i].name
                }
            }
        }
        return activeRoute
    }
    getRoutes = routes => {
        return routes.map((route, key) => {
            if (route.collapse) {
                return this.getRoutes(route.views)
            }
            if (route.layout === "/admin") {
                return <Route path={route.layout + route.path} component={route.component} key={key} />
            } else {
                return null
            }
        })
    }

    handleDrawerToggle = () => {
        this.setState(({ drawerOpen }) => ({
            drawerOpen: !drawerOpen,
        }))
        console.log("toggle drawer")
    }

    render() {
        return (
            <div>
                <Drawer
                    routes={routes}
                    logoText={"Plant system <3"}
                    logo={logo}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.drawerOpen}
                />
                <Switch>{this.getRoutes(routes)}</Switch>
            </div>
        )
    }
}

export default Admin
