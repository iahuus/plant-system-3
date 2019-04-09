import React from "react"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Card from "@material-ui/core/Card"
import { Avatar, Button, CardContent, CardHeader, Typography } from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import plants_icon from "../../assets/img/plants_icon.png"
import PlusIcon from "@material-ui/icons/Add"
import NewPlantModal from "./NewPlantModal"

const styles = theme => ({
    list: {
        minWidth: 300,
    },
    action: {
        margin: 0,
    },
})

const Plants = props => {
    const { classes, plants, onClickPlant, toggleNewPlant, onSubmitNewPlant, newPlantOpen } = props
    return (
        <div>
            <Card className={classes.root}>
                <CardHeader
                    className={classes.cardHeader}
                    title={"Plants"}
                    avatar={<Avatar src={plants_icon} />}
                    action={
                        <Button mini color={"primary"} variant={"fab"} onClick={toggleNewPlant}>
                            <PlusIcon fontSize={"small"} />
                        </Button>
                    }
                    classes={{ action: classes.action }}
                />
                <Divider />
                {plants ? (
                    <CardContent>
                        <List className={classes.list}>
                            {plants.map(plant => {
                                return (
                                    <ListItem key={plant.id} button onClick={() => onClickPlant(plant.id)}>
                                        <ListItemText primary={plant.name} secondary={plant.plant_type.name} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </CardContent>
                ) : (
                    <div>
                        <Typography gutterBottom={true} variant={"h5"}>
                            No plants available
                        </Typography>
                    </div>
                )}
            </Card>
            <NewPlantModal open={newPlantOpen} onSubmit={onSubmitNewPlant} onClose={toggleNewPlant} />
        </div>
    )
}

export default withStyles(styles)(Plants)
