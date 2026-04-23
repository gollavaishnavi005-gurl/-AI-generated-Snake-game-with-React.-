import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction, GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const moveRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food doesn't spawn on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection(Direction.RIGHT);
    setIsGameOver(false);
    setIsPaused(true);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Collision Check: Walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Collision Check: Self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Collision Check: Food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== Direction.DOWN) setDirection(Direction.UP); break;
        case 'ArrowDown': if (direction !== Direction.UP) setDirection(Direction.DOWN); break;
        case 'ArrowLeft': if (direction !== Direction.RIGHT) setDirection(Direction.LEFT); break;
        case 'ArrowRight': if (direction !== Direction.LEFT) setDirection(Direction.RIGHT); break;
        case ' ': 
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      moveRef.current = setInterval(moveSnake, speed);
    } else {
      if (moveRef.current) clearInterval(moveRef.current);
    }
    return () => {
      if (moveRef.current) clearInterval(moveRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
       ctx.beginPath();
       ctx.moveTo(i * size, 0);
       ctx.lineTo(i * size, canvas.height);
       ctx.stroke();
       ctx.beginPath();
       ctx.moveTo(0, i * size);
       ctx.lineTo(canvas.width, i * size);
       ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#00cccc';
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = '#00ffff';
      
      // Rounded rectangles for snake body
      const x = segment.x * size + 2;
      const y = segment.y * size + 2;
      const w = size - 4;
      const h = size - 4;
      const radius = 4;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  return (
    <div className="relative group p-4 bg-[#12122b] rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] transition-all hover:shadow-[0_0_50px_rgba(0,255,255,0.2)]">
      <div className="flex justify-between items-center mb-4 font-mono">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-500 uppercase tracking-widest opacity-70">Current Score</span>
          <span className="text-2xl text-white font-bold glow-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-xs text-purple-500 uppercase tracking-widest opacity-70">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="text-2xl text-white font-bold glow-purple">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-square max-w-[500px] mx-auto overflow-hidden rounded-xl border-2 border-cyan-500/50">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full block cursor-none"
        />

        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setIsPaused(false)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(0,255,255,0.5)]"
              >
                <Play className="w-10 h-10 text-white fill-current ml-1" />
              </motion.div>
              <p className="mt-4 text-white font-mono text-lg uppercase tracking-tighter">Press SPACE to Start</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-8"
            >
              <h2 className="text-5xl font-mono font-black text-red-500 text-center mb-2 tracking-tighter shadow-red-500">GAME OVER</h2>
              <p className="text-white/70 font-mono text-sm uppercase mb-8">Score: {score}</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center gap-3 px-8 py-4 bg-cyan-500 text-white font-mono font-bold rounded-full shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                TRY AGAIN
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest">
         <span>Controls: ARROWS to move</span>
         <span>SPACE to pause</span>
      </div>
    </div>
  );
}
