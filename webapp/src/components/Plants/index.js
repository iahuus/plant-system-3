import React from "react"
import PlantsComponent from "./Plants"
import { Redirect } from "react-router-dom"
import axios from "axios"
import { Typography } from "@material-ui/core"

const plants = [
    {
        id: 1,
        name: "Kul plante",
        plant_type: "Rose",
    },
    {
        id: 2,
        name: "Kul plante",
        plant_type: "Rose",
    },
    {
        id: 3,
        name: "Kul plante",
        plant_type: "Rose",
    },
    {
        id: 4,
        name: "Kul plante",
        plant_type: "Rose",
    },
]

class Plants extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectTo: null,
            plants: null,
            newPlantOpen: false,
        }
    }

    componentDidMount() {
        axios.get("/plants").then(res => {
            let plants = res.data
            this.setState({ plants })
        })
    }

    onClickPlant = id => {
        this.setState({ redirectTo: id })
        console.log(`Plant ${id} clicked!`)
    }

    onSubmitNewPlant = () => {
        console.log("New plant")
        this.setState({ newPlantOpen: false })
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={`/plants/${this.state.redirectTo}`} />
        } else if (this.state.plants) {
            return (
                <PlantsComponent
                    onClickNewPlant={() => this.setState({ newPlantOpen: true })}
                    plants={this.state.plants}
                    onClickPlant={this.onClickPlant}
                    onSubmitNewPlant={this.onSubmitNewPlant}
                    newPlantOpen={this.state.newPlantOpen}
                />
            )
        } else {
            return (
                <div>
                    <Typography variant={"h3"}>No plants available</Typography>
                </div>
            )
        }
    }
}

export default Plants
