import React from "react"
import Card from "@material-ui/core/Card"
import { withStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const styles = theme => ({
    content: {
        display: "flex",
        flexDirection: "column",
        minWidth: 500,
        "& > *, & > form > *": {
            marginTop: 24,
        },
    },
})

const PlantComponent = props => {
    const { classes, plant, edit, changes, onChange, onPressEdit, submitChanges } = props
    console.log(plant.humidity_readings)
    const content =
        edit && changes ? (
            <CardContent className={classes.content}>
                <form className={classes.content}>
                    <TextField label={"Name"} name={"name"} value={changes.name} onChange={onChange} />
                    <TextField
                        label={"Plant type"}
                        name={"plant_type"}
                        value={changes.plant_type}
                        onChange={onChange}
                    />
                    <Button variant={"contained"} type={"submit"} color={"primary"} onClick={submitChanges}>
                        Submit changes
                    </Button>
                </form>
            </CardContent>
        ) : (
            <CardContent className={classes.content}>
                <div>
                    <Typography>Name</Typography>
                    <Typography variant={"h5"}>{plant.name}</Typography>
                </div>
                <div>
                    <Typography>Plant type</Typography>
                    <Typography variant={"h5"}>{plant.plant_type.name}</Typography>
                </div>
                <Divider />
                <div>
                    <Typography>Humidity readings</Typography>
                    <LineChart width={450} height={450} data={plant.humidity_readings}>
                        <Line type={"monotone"} dot={false} dataKey={"value"} />
                        <CartesianGrid />
                        <XAxis dataKey={"time_stamp"} />
                        <YAxis label={"Humidity"} domain={[0, 110]} />
                    </LineChart>
                </div>
            </CardContent>
        )
    return (
        <Card>
            <CardHeader
                title={`${plant.name}`}
                subheader={`ID: ${plant.id}`}
                action={<Button onClick={onPressEdit}>Edit</Button>}
            />
            <Divider />
            {content}
        </Card>
    )
}

export default withStyles(styles)(PlantComponent)
