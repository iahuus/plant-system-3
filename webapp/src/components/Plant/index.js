import React from "react"
import PlantComponent from "./Plant"
import axios from "axios"

class Plant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plant: null,
            edit: false,
            changes: null,
        }
    }

    componentDidMount() {
        const id = parseInt(this.props.match.params.id)
        axios.get(`/plants/${id}`).then(({ data }) => {
            this.setState({ plant: data, id })
        })
    }

    onChange = e => {
        this.setState({ changes: { ...this.state.changes, [e.target.name]: e.target.value } })
    }

    submitChanges = e => {

        axios.patch(`/plants/${this.state.id}`, { ...this.state.changes })
    }

    render() {
        const { plant } = this.state
        return plant ? (
            <PlantComponent
                plant={plant}
                onPressEdit={() => this.setState({ edit: !this.state.edit })}
                onChange={this.onChange}
                edit={this.state.edit}
                changes={{ ...plant, ...this.state.changes }}
                submitChanges={this.submitChanges}
            />
        ) : null
    }
}

export default Plant
