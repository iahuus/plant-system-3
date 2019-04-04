import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Card from "@material-ui/core/Card"
import { Avatar, CardContent, CardHeader } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import plants_icon from "../../assets/img/plants_icon.png"

const styles = theme => ({
    list: {
        minWidth: 300,
    },
})

const Plants = props => {
    const { classes, plants, onClickPlant } = props
    return (
        <Card className={classes.root}>
            <CardHeader title={"Plants"} avatar={<Avatar src={plants_icon} />} />
            <Divider />
            <CardContent>
                <List className={classes.list}>
                    {plants.map(plant => {
                        return (
                            <ListItem key={plant.id} button onClick={() => onClickPlant(plant.id)}>
                                <ListItemText primary={plant.name} secondary={plant.plant_type} />
                            </ListItem>
                        )
                    })}
                </List>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(Plants)
