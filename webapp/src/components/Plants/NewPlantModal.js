import React from "react"
import Modal from "@material-ui/core/Modal"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import { withStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import cn from "class-names"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import axios from "axios"
import { CardContent } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"

const styles = theme => ({
    modal: {
        height: "100%",
    },
    root: {
        padding: 24,
    },
    flexColumnCenter: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        "& > button": {
            marginTop: 24,
            height: 32,
        },
    },
    card: {
        padding: 24,
    },
    closeButton: {
        left: -30,
        top: -15,
    },
})

class NewPlantModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            plant_type: "",
            plantTypes: [],
        }
    }

    componentDidMount() {
        axios.get("/planttypes").then(res => {
            this.setState({ plantTypes: res.data })
            console.log(res.data)
        })
    }

    onSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        axios.post("/plants", { name: this.state.name, plant_type: this.state.plant_type }).then(() => {
            this.props.onSubmit()
        })
    }

    render() {
        const { classes, open } = this.props
        return (
            <Modal open={open} className={cn(classes.modal, classes.flexColumnCenter)}>
                <Card className={classes.card}>
                    <div>
                        <Button className={classes.closeButton} size={"small"} onClick={this.props.onClose}>
                            <CloseIcon fontSize={"small"} />
                        </Button>
                    </div>
                    <Typography gutterBottom={true} variant={"h4"}>
                        New plant
                    </Typography>
                    <Divider />
                    <CardContent>
                        <form className={cn(classes.flexColumnCenter, classes.form)} onSubmit={this.onSubmit}>
                            <TextField
                                value={this.state.name}
                                onChange={e => this.setState({ name: e.target.value })}
                                label={"Name"}
                            />
                            <FormControl fullWidth={true}>
                                <InputLabel htmlFor={"plant_type"}>Choose plant type</InputLabel>
                                <Select
                                    inputProps={{ name: "plant_type", id: "plant_type" }}
                                    value={this.state.plant_type}
                                    onChange={e => this.setState({ plant_type: e.target.value })}
                                >
                                    {this.state.plantTypes.map(plantType => {
                                        return (
                                            <MenuItem value={plantType.id} key={plantType.id}>
                                                {plantType.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <Button color={"primary"} variant={"extendedFab"} type={"submit"}>
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        )
    }
}

export default withStyles(styles)(NewPlantModal)
