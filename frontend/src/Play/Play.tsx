import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import { Box, Button, Typography } from "@mui/material";
import { Stage, Layer, Image, Rect, Line } from "react-konva";
import useImage from "use-image";
import axios from "axios";

enum MarkState {
  none,
  hovered,
  cross,
  circle
}

interface BoardProperties {
  size: number;
  side: MarkState.cross | MarkState.circle;
  winnerCallback: (winner: string) => void;
}

function calculateWinner<T>(squares: T[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i]};
    }
  }
  return null;
}

function Board(bp: BoardProperties) {
  const [state, setState]: [MarkState[], Dispatch<SetStateAction<MarkState[]>>] = useState(Array(9).fill(false));
  const [imageUrls, setImageUrls] = useState({
    board: null,
    cross: null,
    circle: null
  });
  const [isXNext, setIfXNext] = useState(false);
  const [isGameOver, setIfGameOver] = useState(false);
  const [winningPoints, setWinningPoints] = useState(new Array<number>());

  const defaultBoardUrl = process.env.PUBLIC_URL + "/board.png";
  const defaultCrossUrl = process.env.PUBLIC_URL + "/cross.png";
  const defaultCircleUrl = process.env.PUBLIC_URL + "/circle.png";

  const [boardImage] = useImage(imageUrls.board ?? defaultBoardUrl);
  const [crossImage] = useImage(imageUrls.cross ?? defaultCrossUrl);
  const [circleImage] = useImage(imageUrls.circle ?? defaultCircleUrl);

  const side = bp.side;

  const images: Partial<Record<MarkState, HTMLImageElement | undefined>> = {
    [MarkState.cross]: crossImage, 
    [MarkState.circle]: circleImage};
  images[MarkState.hovered] = images[isXNext ? MarkState.cross : MarkState.circle];
  
  const markSize = (bp.size / 3);
  const markOffsetX = (bp.size / 3);
  const markOffsetY = (bp.size / 3);

  const scale = 0.75;

  const updateImages = async () => {
    const userSkinReq = await axios.get(`${process.env.REACT_APP_API_URL}/api/userSkins`, {withCredentials: true});
    if(userSkinReq.status != 200) return;

    const userSkins = userSkinReq.data;
    setImageUrls(userSkins);
  };

  useEffect(() => {
    updateImages();
  }, [setImageUrls]);

  return (
    <React.Fragment>
      <Image image={boardImage} width={bp.size} height={bp.size} />
      {new Array(9).fill(0).map((x,i) => {
        return <Image image={state[i] == MarkState.none ? undefined : images[state[i]]} 
          key={i} width={markSize} height={markSize} 
          opacity={state[i] == MarkState.hovered ? 0.5 : 1}
          x={markOffsetX * (i%3) + markSize/2} 
          y={markOffsetY * (Math.floor(i/3)) + markSize/2 + 5}
          offsetX={markSize/2}
          offsetY={markSize/2}
          scale={{x: scale, y: scale}}

          onMouseEnter={() => {
            if(state[i] == MarkState.cross || state[i] == MarkState.circle || isGameOver) return;

            setState(sState => {
              const newState = [...sState];
              newState[i] = MarkState.hovered;

              return newState;
            });
          }}
          onMouseLeave={() => {
            if(state[i] == MarkState.cross || state[i] == MarkState.circle || isGameOver) return;

            setState(sState => {
              const newState = [...sState];
              newState[i] = MarkState.none;

              return newState;
            });
          }}
          onClick={() => {
            if(state[i] == MarkState.cross || state[i] == MarkState.circle || isGameOver) return;

            setState(sState => {
              const newState = [...sState];
              newState[i] = isXNext ? MarkState.cross : MarkState.circle;

              const result = calculateWinner(newState.map(s => s == MarkState.hovered ? MarkState.none : s));
              if(result) {
                setIfGameOver(true);
                const newWinningPoints: number[] = [];
                result.line.forEach(point => {
                  const x = markOffsetX * (point % 3) + markSize / 2;
                  const y = markOffsetY * (Math.floor(point / 3)) + markSize / 2;

                  newWinningPoints.push(x, y);
                });

                setWinningPoints(newWinningPoints);
                bp.winnerCallback(result.winner == 2 ? "Cross" : "Circle");
              }

              return newState;
            });

            setIfXNext(cv => !cv);
          }}/>;
      })}
      <Line visible={true} points={winningPoints} stroke="black" strokeWidth={20}/>
    </React.Fragment>
  );
}

export default function Play() {
  const boardSize = 600;
  const [gameId, setGameId] = useState(0);
  const [winMessage, setWinMessage] = useState("");

  const advanceGame = () => {
    setGameId(gameId + 1);
    setWinMessage("");
  };

  const onWinner = (winner: string) => {
    setWinMessage(`The winner is ${winner}!`);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
      <Typography>{winMessage}</Typography>
      <Stage width={boardSize} height={boardSize}>
        <Layer>
          <Board winnerCallback={onWinner} key={gameId} size={boardSize} side={MarkState.circle}/>
        </Layer>
      </Stage>
      <Button sx={{alignSelf: "flex-end", marginBottom: "100px"}} 
        variant="contained"
        onClick={advanceGame}>
        Reset Game
      </Button>
    </Box>
  );
}