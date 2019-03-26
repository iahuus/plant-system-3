import React from "react"
import DrawerComponent from "./Drawer"

class Drawer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    render() {
        return <DrawerComponent open={this.state.open} {...this.props} />
    }
}

export default Drawer
