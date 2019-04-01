import React from "react"
import PlantComponent from "./Plant"

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

class Plant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plant: null,
        }
    }

    componentDidMount() {
        const id = parseInt(this.props.match.params.id)
        const plant = plants.find(p => p.id === id)
        this.setState({ plant })
    }

    render() {
        const { plant } = this.state
        return plant ? <PlantComponent plant={plant} /> : null
    }
}

export default Plant
