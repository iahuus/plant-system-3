import React from "react"
import PlantsComponent from "./Plants"
import { Redirect } from "react-router-dom"

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
        }
    }
    onClickPlant = id => {
        this.setState({ redirectTo: id })
        console.log(`Plant ${id} clicked!`)
    }

    render() {
        return !this.state.redirectTo ? (
            <PlantsComponent plants={plants} onClickPlant={this.onClickPlant} />
        ) : (
            <Redirect to={`/plants/${this.state.redirectTo}`} />
        )
    }
}

export default Plants
