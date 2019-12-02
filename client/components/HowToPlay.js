import React from 'react'
import {Link} from 'react-router-dom'
import {
  CardMedia,
  CardActionArea,
  makeStyles,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles({
  card: {
    maxWidth: 400
  },
  media: {
    height: 200
  }
})

export default function HowToPlay() {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://www.ultraboardgames.com/codenames/gfx/spy.jpg"
          title="spy"
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h2">
            Codewords
          </Typography>
          <Typography variant="h6" color="textSecondary" component="p">
            How to Start a Game:
          </Typography>
          <Typography variant="body2" component="p">
            Type in a room name and click 'Create a Room' to create a new room.<br />
            <br />
            <br />
          </Typography>
          <Typography variant="h6" color="textSecondary" component="p">
            How to Join a Game:
          </Typography>
          <Typography variant="body2" component="p">
            To join a room, click 'Find Available Rooms' and click on a room
            name.
            <br />
            <br />
            <br />
          </Typography>
          <Typography variant="h6" color="textSecondary" component="p">
            How to Play Codewords:
          </Typography>
          <Typography variant="body2" component="p">
            Players split up into teams of two. You need four players to begin a
            game. Each team has one player as their codemaster. Both codemasters
            can see the colored 'codemaster' view. <br />
            <br />
            The other players are 'guessers' and they take turns guessing words
            that may match the clue their codemaster provides.
            <br />
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link to="/">
          <Button size="small" color="primary">
            Back to Game
          </Button>
        </Link>

        <Button
          href="https://czechgames.com/files/rules/codenames-rules-en.pdf"
          size="small"
          color="primary"
        >
          More Info
        </Button>
      </CardActions>
    </Card>
  )
}
