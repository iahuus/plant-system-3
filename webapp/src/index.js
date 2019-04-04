import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import { createBrowserHistory } from "history"
import { Router, Route, Switch, Redirect } from "react-router-dom"
import Plants from "./components/Plants"
import Plant from "./components/Plant"
import axios from "axios"
import { API_URL } from "./constants"

const hist = createBrowserHistory(API_URL)
axios.defaults.baseURL = API_URL
axios.defaults.headers["Access-Control-Allow-Origin"] = "*"

ReactDOM.render(
    <div className={"App"}>

        <Router history={hist}>
            <Switch>
                <Route path="/plants" exact component={Plants} />
                <Route path="/plants/:id" exact component={Plant} />
                <Redirect to={"/plants"} />
            </Switch>
        </Router>
    </div>,
    document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
