import React from "react"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
})

const Plants = props => {
    return (
        <div>
            <h1>Plants view</h1>
        </div>
    )
}

export default withStyles(styles)(Plants)
