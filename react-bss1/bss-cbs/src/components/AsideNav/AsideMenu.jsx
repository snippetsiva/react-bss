import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
        root: {
                paddingLeft:30
        }
}));


export default function ClippedDrawer(props) {

  const classes = useStyles();

  const {menuItems} = props;

  return (
    <div className={classes.root}>
            <List>
            {menuItems.map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
    </div>
  );
}
