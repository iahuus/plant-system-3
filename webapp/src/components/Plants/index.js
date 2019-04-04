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
        }
    }

    componentDidMount() {
        axios.get("/plants").then(plants => {
            console.log(plants)
            this.setState({ plants: plants.data })
        })
    }

    onClickPlant = id => {
        this.setState({ redirectTo: id })
        console.log(`Plant ${id} clicked!`)
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={`/plants/${this.state.redirectTo}`} />
        } else if (this.state.plants) {
            return <PlantsComponent plants={this.state.plants} onClickPlant={this.onClickPlant} />
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
