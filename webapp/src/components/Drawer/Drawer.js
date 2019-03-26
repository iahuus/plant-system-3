import React from "react"
import IconButton from "@material-ui/core/IconButton"
import MuiDrawer from "@material-ui/core/Drawer"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
    root: {},
})

const DrawerComponent = props => {
    const { onClose, open, theme, routes } = props
    return (
        <MuiDrawer variant="permanent" open={false}>
            <div>
                <IconButton onClick={() => console.log("close")}>
                    {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />

        </MuiDrawer>
    )
}

export default withStyles(styles, { withTheme: true })(DrawerComponent)
