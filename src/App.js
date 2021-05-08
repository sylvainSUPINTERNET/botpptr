import React from "react";
import {useEffect} from "react";
import './App.css';
import {AppBar, Toolbar, IconButton, Typography, Button, Container, Box, Tabs, Paper, Tab, Drawer,Divider, List, ListItem, ListItemText} from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import AcUnit from '@material-ui/icons/AcUnit';
import GpsFixedTwoToneIcon from '@material-ui/icons/GpsFixedTwoTone';
import { Workspace } from "./components/workspace/workspace";
import {appConfig} from "./components/common/utils";



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


function App() {
  const [targetName, setTargetName] = React.useState(appConfig.SOURCE_TARGET_NAME_BUMBLE);

  const classes = useStyles();
  
  useEffect( () => {

  }, []);

  return (
  <Box component="span" m={0}>
      <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Box>
            <AcUnit style={{"marginTop": "-10px"}} /> Botpptr
          </Box>
        </Typography>
      </Toolbar>
    </AppBar>

    <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
      <Box flexGrow={1}>
          <Box p={3}>
            <Typography variant="h4">
              <GpsFixedTwoToneIcon style={{"marginTop": "-10px"}} /> Source
            </Typography>
            <Divider/>
            <List component="nav" aria-label="secondary mailbox folders">
            <ListItem button onClick={ (ev) => {setTargetName(appConfig.SOURCE_TARGET_NAME_BUMBLE) }}>
              <ListItemText primary={appConfig.SOURCE_TARGET_NAME_BUMBLE}/>
            </ListItem>
            <ListItem button onClick={ (ev) => {setTargetName(appConfig.SOURCE_TARGET_NAME_LINKEDIN) }}>
              <ListItemText primary={appConfig.SOURCE_TARGET_NAME_LINKEDIN}/>
            </ListItem>
          </List>
          </Box>
      </Box>
      
      <Workspace targetName={targetName}/>

    </Box>


    </Box>
  );
}

export default App;
