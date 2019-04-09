import React from "react"
import PlantsComponent from "./Plants"
import { Redirect } from "react-router-dom"
import axios from "axios"

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
    }

    onSubmitNewPlant = () => {
        this.setState({ newPlantOpen: false })
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={`/plants/${this.state.redirectTo}`} />
        }
        return (
            <PlantsComponent
                toggleNewPlant={() => this.setState({ newPlantOpen: !this.state.newPlantOpen })}
                plants={this.state.plants}
                onClickPlant={this.onClickPlant}
                onSubmitNewPlant={this.onSubmitNewPlant}
                newPlantOpen={this.state.newPlantOpen}
            />
        )
    }
}

export default Plants
