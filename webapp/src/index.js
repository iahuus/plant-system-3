import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import { createBrowserHistory } from "history"
import { MuiThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Router, Route, Switch, Redirect } from "react-router-dom"
import AdminLayout from "./layouts/Admin"
import theme from "./style/themes/defaultTheme"

const hist = createBrowserHistory()

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CssBaseline>
            <Router history={hist}>
                <Switch>
                    <Route path="/admin" component={AdminLayout} />
                    <Redirect from="/" to="/admin/plants" />
                </Switch>
            </Router>
        </CssBaseline>
    </MuiThemeProvider>,
    document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
