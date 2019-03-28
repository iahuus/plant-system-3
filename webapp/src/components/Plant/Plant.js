import React from "react"
import Card from "@material-ui/core/Card"
import { withStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import { TextField } from "@material-ui/core"

const styles = theme => ({
    content: {
        display: "flex",
        flexDirection: "column",
    },
})

const PlantComponent = props => {
    const { classes, plant } = props
    return (
        <Card>
            <CardHeader title={`${plant.name}`} />
            <CardContent className={classes.content}>
                <form>
                    <TextField variant={"outlined"}>{plant.name}</TextField>
                    <TextField variant={"outlined"}>{plant.plant_type}</TextField>
                </form>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(PlantComponent)
