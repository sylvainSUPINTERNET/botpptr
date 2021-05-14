import React from 'react';

import {AppBar, Toolbar, IconButton, Typography, Button, Container, Box, Tabs, Paper, Tab, Drawer,Divider, List, ListItem, ListItemText, FormControl, InputLabel, Input, FormHelperText,OutlinedInput} from "@material-ui/core"
import Build from '@material-ui/icons/BuildOutlined';
import {appConfig} from "../common/utils";
import {wsConfig} from "../common/wsConfig";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import {startAnalysis} from "../api/bumbleProfile";

// https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
const WorkspaceForm = (props) => {
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [swipe, setSwipe] = React.useState(1);
    const [synchronizeKey, setSynchronizeKey] = React.useState("");

    let [collectedProfiles, setCollectedProfiles] = React.useState([]);
    let [collectedLiveProfiles, setCollectedLiveProfiles] = React.useState([]);

    const getSubHash = () => {
        return subHash;
    }


    const [subHash, setSubHash] = React.useState(localStorage.getItem("subKey") ? localStorage.getItem("subKey") : "");
    const [sharedSubHash, setSharedSubHash] = React.useState(localStorage.getItem("subSharedKey") ? localStorage.getItem("subSharedKey") : "");

    const submitForm = (ev) => {
        if ( login !== "" && password !== "" ) {
            const wsClient = new W3CWebSocket(wsConfig.WS_URL);

            wsClient.onmessage = async (ev) => {
              let data = JSON.parse(ev.data);
              console.log("RECEIVED", data);

              let {source, type, subKey, subSharedKey} = data;


              if ( data.type === wsConfig.NEW_SUB_BUMBLE_ANALYSIS_PROFILES) {
                console.log('new sub, receiving hash key');

                setSubHash(subKey)
                setSharedSubHash(subSharedKey);

                localStorage.setItem("subKey", subKey);
                localStorage.setItem("subSharedKey", subSharedKey);
    

                const resp = await startAnalysis(subKey, subSharedKey, login, password, swipe);
                const collectedProfiles = await resp.json();
                console.log("COLLECTED WITH SUCCESS")
                console.log(collectedProfiles);
                setCollectedProfiles(collectedProfiles);
              } 


              if ( data.type === wsConfig.BUMBLE_ANALYSIS_ROFILE && subKey === localStorage.getItem("subKey") && subSharedKey === localStorage.getItem("subSharedKey")) {
                  console.log("RECEIVED PROFILE : ");
                  console.log(subHash)
                  console.log(sharedSubHash)
                  console.log(data)
                  collectedLiveProfiles = [...collectedLiveProfiles, data];
                  setCollectedLiveProfiles(collectedLiveProfiles);
              }

            }
        }
    }

    const submitSync = (ev) => {
        const wsClientSync = new W3CWebSocket(wsConfig.WS_URL + `?key=${synchronizeKey}`);

        wsClientSync.onmessage = async (ev) => {
            let data = JSON.parse(ev.data);
            console.log("RECEIVED SYNCHRONIZATION", data);

            let {source, type, subKey, subSharedKey} = data;

            if ( data.type === wsConfig.BUMBLE_ANALYSIS_ROFILE /*&& subKey === localStorage.getItem("subKey") && subSharedKey === localStorage.getItem("subSharedKey")*/) {
                console.log("RECEIVED SYNCHRONIZATION PROFILE : ");
                console.log(subHash)
                console.log(sharedSubHash)
                console.log(data)
                collectedLiveProfiles = [...collectedLiveProfiles, data];
                setCollectedLiveProfiles(collectedLiveProfiles);
            }

          }
    }



    if ( props.source === appConfig.SOURCE_TARGET_NAME_BUMBLE) {
    return (
        <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
                <Box flexGrow={1} flexDirection="row">
                <h3>BOT Facebook account credentials</h3>
                <Box flexGrow="1">
                    <FormControl>
                        <InputLabel htmlFor="bot-fb-credentials-login">Login</InputLabel>
                        <Input id="bot-fb-credentials-login" aria-describedby="facebook credentials for bot account" value={login} onChange={ (ev) => setLogin(ev.target.value)}/>
                    </FormControl>
                </Box>
                <Box flexGrow="1" mt={5} mb={5}>
                <FormControl>
                        <InputLabel htmlFor="bot-fb-credentials-password">Password</InputLabel>
                        <Input type="password" id="bot-fb-credentials-password" aria-describedby="facebook credentials for bot account" value={password} onChange={ (ev) => setPassword(ev.target.value)}/>
                    </FormControl>
                </Box>
                <Box flexGrow="1" mt={5} mb={5}>
                <FormControl>
                        <InputLabel htmlFor="bot-number-swipe">Swipe</InputLabel>
                        <Input type="number" id="bot-number-swipe" aria-describedby="swipe" value={swipe} onChange={ (ev) => setSwipe(ev.target.value)}/>
                    </FormControl>
                </Box>
                <Box flexGrow="1" mt={5} mb={5}>
                    <Box>
                        <Button variant="outlined" color="primary" onClick={submitForm}>Start</Button>
                    </Box>
                </Box>

                </Box>
                <Box flexGrow={15}>
                    <h3>Analysis</h3>
                    <Box>Your secret key : {subHash}</Box>
                    <Box>You shared key : {sharedSubHash}</Box>
                    <h3> Synchronize with analysis</h3>
                    <small>Using your key / invit key to synchronize with processing analysis</small>
                    <Box flexGrow="1" mt={5} mb={5}>
                        <FormControl>
                            <InputLabel htmlFor="bot-synchronize">Synchronize</InputLabel>
                            <Input type="text" id="bot-synchronize" aria-describedby="synchronize" value={synchronizeKey} placeholder="<your key>" onChange={ (ev) => setSynchronizeKey(ev.target.value)}/>
                        </FormControl>
                        <Button variant="outlined" color="primary" onClick={submitSync}>Synchronize</Button>
                    </Box>
                    <ProfileCard collected={collectedProfiles} collectedLive={collectedLiveProfiles}></ProfileCard>
                </Box>
        </Box>
    )
    } else {
        return (
            <Box>
                <p>LINKEDIN WIP</p>
            </Box>
        )
    }
}



export const ProfileCard = (props) => {

    let {collected, collectedLive} = props;

    console.log("LIVED COLLECTED")
    console.log(collectedLive)

    if ( collected.profiles ) {
        collected = collected.profiles;
    }

    return (
        <Container >
            <Box display="flex" mt={5}>
                <Box flexGrow={1}>
                <h3>Completed collected</h3>
                {
                        collected.map( profileLive => {
                            return <div>
                                {profileLive.name}
                                </div>
                        })
                    }
                </Box>
                <Box flexGrow={1}>
                    <h3>Live</h3>
                    {
                        collectedLive.map( profile => {
                            return <div>
                                {profile.name}
                                </div>
                        })
                    }
                </Box>
            </Box>
        </Container>
    )
}

export const Workspace = (props) => {
    return ( <Box flexGrow={5} style={{"background": "pink"}}>
        <Button p={1} bgcolor="grey.800">
          <Typography variant="h5">
                <Build style={{"marginTop": "-10px"}} /> Workspace - { props.targetName }
          </Typography>
        </Button>
        <WorkspaceForm source={props.targetName}/>
      </Box>)
}