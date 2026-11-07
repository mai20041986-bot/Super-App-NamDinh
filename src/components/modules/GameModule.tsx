import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import contentData from '../../data/contentData.json';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award,
} from 'lucide-react';

/* ==========================================================================
   GAME CONFIGURATION CONSTANTS
   ========================================================================== */
const WIN_SCORE = 20;
const GRAVITY = 0.28; // Gentle gravity for enjoyable counter play
const JUMP_FORCE = -5.8; // Smooth jump
const PIPE_SPEED = 2.0; // Moderate speed (45-75s play time)
const PIPE_GAP = 145; // Generous gap for casual players
const PIPE_SPACING = 210; // Distance between pipes
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

interface GameModuleProps {
  onBackToMenu: () => void;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export const GameModule: React.FC<GameModuleProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game States: 'idle' | 'playing' | 'won' | 'lost'
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('flappy_best_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [currentVoucher, setCurrentVoucher] = useState<string | null>(null);
  const [recentVoucher, setRecentVoucher] = useState<string | null>(() => {
    try {
      return localStorage.getItem('flappy_recent_voucher') || null;
    } catch {
      return null;
    }
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [encouragement, setEncouragement] = useState<string>('Khởi động nhẹ nhàng!');

  // Mutable game physics & loop refs
  const animationFrameId = useRef<number | null>(null);
  const birdY = useRef<number>(180);
  const birdVelocity = useRef<number>(0);
  const birdAngle = useRef<number>(0);
  const pipes = useRef<Pipe[]>([]);
  const frameCount = useRef<number>(0);
  const isShaking = useRef<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio Context for simple synthesized sound
  const playSound = useCallback((type: 'jump' | 'score' | 'win' | 'hit') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'score') {
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        // Little fanfare
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  /* ==========================================================================
     VOUCHER GENERATION & LOGIC
     ========================================================================== */
  const generateVoucherCode = (): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* ==========================================================================
     GAME LIFECYCLE: START, WIN, LOSE, RESET
     ========================================================================== */
  const resetGame = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    const canvas = canvasRef.current;
    const initialY = canvas ? canvas.height / 2 : 180;
    birdY.current = initialY;
    birdVelocity.current = 0;
    birdAngle.current = 0;
    pipes.current = [];
    frameCount.current = 0;
    isShaking.current = false;
    setScore(0);
    setEncouragement('Khởi động nhẹ nhàng!');
    setGameState('idle');
  }, []);

  const winGame = useCallback((finalScore: number) => {
    setGameState('won');
    playSound('win');

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#005baa', '#ed1c24', '#f59e0b', '#10b981'],
      });
    } catch {
      // Fallback
    }

    const newVoucher = generateVoucherCode();
    setCurrentVoucher(newVoucher);
    setRecentVoucher(newVoucher);

    try {
      localStorage.setItem('flappy_recent_voucher', newVoucher);
      localStorage.setItem('flappy_best_score', String(WIN_SCORE));
    } catch {
      // Storage unavailable
    }
    setBestScore(WIN_SCORE);

    // Trigger external callback if present
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: finalScore,
        voucherCode: newVoucher,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }
  }, [playSound]);

  const endGame = useCallback((finalScore: number) => {
    setGameState('lost');
    playSound('hit');
    isShaking.current = true;
    setTimeout(() => {
      isShaking.current = false;
    }, 300);

    // Save best score
    setBestScore((prev) => {
      const updated = Math.max(prev, finalScore);
      try {
        localStorage.setItem('flappy_best_score', String(updated));
      } catch {
        // Storage unavailable
      }
      return updated;
    });

    // Trigger external callback if present
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [playSound]);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      birdVelocity.current = JUMP_FORCE;
      playSound('jump');
    }
  }, [gameState, playSound]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    birdY.current = canvas.height / 2;
    birdVelocity.current = JUMP_FORCE * 0.8;
    pipes.current = [];
    frameCount.current = 0;
    setScore(0);
    setGameState('playing');
    playSound('jump');
  }, [playSound]);

  /* ==========================================================================
     PHYSICS & RENDER LOOP
     ========================================================================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background
      ctx.clearRect(0, 0, width, height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.7, '#f0f9ff');
      skyGrad.addColorStop(1, '#dbeafe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // City skyline background / soft bank clouds
      ctx.fillStyle = '#bfdbfe55';
      ctx.beginPath();
      ctx.arc(60, height - 70, 45, 0, Math.PI * 2);
      ctx.arc(130, height - 80, 60, 0, Math.PI * 2);
      ctx.arc(220, height - 65, 40, 0, Math.PI * 2);
      ctx.arc(320, height - 85, 55, 0, Math.PI * 2);
      ctx.fill();

      // Ground strip
      const groundHeight = 40;
      ctx.fillStyle = '#005baa';
      ctx.fillRect(0, height - groundHeight, width, groundHeight);
      ctx.fillStyle = '#ed1c24';
      ctx.fillRect(0, height - groundHeight, width, 4);

      if (gameState === 'playing') {
        frameCount.current += 1;

        // Apply Gravity
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;
        birdAngle.current = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVelocity.current * 0.08));

        // Spawn Pipes
        if (frameCount.current % 100 === 0) {
          const minPipe = 50;
          const maxPipe = height - groundHeight - PIPE_GAP - minPipe;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          const bottomHeight = height - groundHeight - (topHeight + PIPE_GAP);

          pipes.current.push({
            x: width,
            topHeight,
            bottomHeight,
            passed: false,
          });
        }

        // Update & Draw Pipes
        for (let i = pipes.current.length - 1; i >= 0; i--) {
          const p = pipes.current[i];
          p.x -= PIPE_SPEED;

          // Draw Top Pipe
          const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + 52, 0);
          pipeGrad.addColorStop(0, '#005baa');
          pipeGrad.addColorStop(0.4, '#0072ce');
          pipeGrad.addColorStop(1, '#003e7e');

          ctx.fillStyle = pipeGrad;
          ctx.fillRect(p.x, 0, 52, p.topHeight);
          // Top pipe cap
          ctx.fillStyle = '#003e7e';
          ctx.fillRect(p.x - 3, p.topHeight - 16, 58, 16);

          // Draw Bottom Pipe
          const bottomY = height - groundHeight - p.bottomHeight;
          ctx.fillStyle = pipeGrad;
          ctx.fillRect(p.x, bottomY, 52, p.bottomHeight);
          // Bottom pipe cap
          ctx.fillStyle = '#003e7e';
          ctx.fillRect(p.x - 3, bottomY, 58, 16);

          // Gold coin symbol inside pipe gap
          const coinCenterY = p.topHeight + PIPE_GAP / 2;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x + 26, coinCenterY, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', p.x + 26, coinCenterY);

          // Scoring Check
          const birdX = 80;
          if (!p.passed && p.x + 52 < birdX) {
            p.passed = true;
            localScore += 1;
            setScore(localScore);
            playSound('score');

            // Dynamic encouragement update
            if (localScore < 5) {
              setEncouragement('Khởi động nhẹ nhàng!');
            } else if (localScore <= 9) {
              setEncouragement('Tốt lắm, tiếp tục nào!');
            } else if (localScore <= 14) {
              setEncouragement('Một nửa chặng đường rồi!');
            } else if (localScore <= 19) {
              setEncouragement('Sắp nhận quà rồi!');
            } else {
              setEncouragement('Xuất sắc!');
            }

            // Check Win Condition: 20 points
            if (localScore >= WIN_SCORE) {
              winGame(WIN_SCORE);
              return;
            }
          }

          // Collision Check
          const birdRadius = 14;
          if (
            birdX + birdRadius > p.x &&
            birdX - birdRadius < p.x + 52 &&
            (birdY.current - birdRadius < p.topHeight ||
              birdY.current + birdRadius > height - groundHeight - p.bottomHeight)
          ) {
            endGame(localScore);
            return;
          }

          // Remove offscreen pipes
          if (p.x < -60) {
            pipes.current.splice(i, 1);
          }
        }

        // Floor / Ceiling Collision
        if (
          birdY.current + 14 >= height - groundHeight ||
          birdY.current - 14 <= 0
        ) {
          endGame(localScore);
          return;
        }
      }

      // Draw Mascot / Flying Bank Card Character
      const birdX = 80;
      ctx.save();
      ctx.translate(birdX, birdY.current);
      ctx.rotate(birdAngle.current);

      // Draw Mini VietinBank Card / Mascot
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 6);
      ctx.fill();

      // Card Body
      const cardGrad = ctx.createLinearGradient(-22, -14, 22, 14);
      cardGrad.addColorStop(0, '#005baa');
      cardGrad.addColorStop(1, '#003e7e');
      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 5);
      ctx.fill();

      // Golden Chip
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-16, -6, 10, 8);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.strokeRect(-16, -6, 10, 8);

      // Red Stripe Accent
      ctx.fillStyle = '#ed1c24';
      ctx.fillRect(-22, 4, 44, 4);

      // Wing animation
      const wingFlap = Math.sin(frameCount.current * 0.3) * 6;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2, -8 + wingFlap, 9, 5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Schedule next frame if game is still active
      if (gameState === 'playing') {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, score, winGame, endGame, playSound]);

  /* ==========================================================================
     KEYBOARD & TOUCH HANDLERS
     ========================================================================== */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'idle') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        } else if (gameState === 'lost' || gameState === 'won') {
          resetGame();
          setTimeout(() => startGame(), 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame, resetGame]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (gameState === 'idle') {
      startGame();
    } else if (gameState === 'playing') {
      jump();
    }
  };

  return (
    <div
      id="flappy-voucher-game"
      ref={containerRef}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300"
    >
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#ed1c24] mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Minigame dành cho khách hàng tại quầy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {GAME_TITLE}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vượt qua 20 thử thách để nhận ngay {VOUCHER_TEXT} VietinBank
          </p>
        </div>

        {/* Audio Toggle & Quick Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 text-[#005baa] border-blue-200'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#005baa]" />
                <span>Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Âm thanh: Tắt</span>
              </>
            )}
          </button>

          {recentVoucher && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-900 font-medium">Mã gần nhất:</span>
              <span className="font-mono font-bold text-amber-700">{recentVoucher}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Screen & Score HUD */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden select-none">
        {/* HUD Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-wider uppercase text-blue-300">
              Điểm: {score}/{WIN_SCORE}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-400 font-medium">
              Kỷ lục: {bestScore}/{WIN_SCORE}
            </span>
          </div>

          <div className="text-xs font-semibold text-emerald-400 animate-pulse">
            {encouragement}
          </div>
        </div>

        {/* Progress Bar (0 to 20) */}
        <div className="w-full bg-slate-200 h-2">
          <div
            className="bg-gradient-to-r from-[#005baa] to-[#ed1c24] h-full transition-all duration-200"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>

        {/* Canvas Area */}
        <div
          className={`relative flex items-center justify-center bg-sky-50 no-zoom-touch cursor-pointer ${
            isShaking.current ? 'animate-bounce' : ''
          }`}
          onPointerDown={handlePointerDown}
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            width={480}
            height={440}
            className="w-full max-w-[520px] h-[380px] sm:h-[440px] block"
          />

          {/* OVERLAY: START SCREEN */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#005baa] text-white flex items-center justify-center shadow-lg ring-4 ring-white/20 animate-pulse">
                <Gamepad2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {GAME_TITLE}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  Vượt qua 20 thử thách để nhận voucher 2 lít xăng
                </p>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-3 rounded-2xl bg-[#ed1c24] hover:bg-[#c41219] text-white text-sm font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                Bắt đầu chơi ngay
              </button>

              <p className="text-xs text-slate-300">
                Chạm vào màn hình hoặc nhấn phím <kbd className="px-2 py-0.5 bg-white/20 rounded font-mono">Space</kbd> để bay
              </p>
            </div>
          )}

          {/* OVERLAY: DEFEAT SCREEN */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-red-600/30 text-[#ed1c24] flex items-center justify-center ring-4 ring-red-500/20">
                <RotateCcw className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  Rất tiếc, bạn đã vượt qua {score}/20 thử thách
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Chỉ còn một chút nữa thôi, hãy thử lại nhé!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    resetGame();
                    setTimeout(() => startGame(), 100);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#005baa] hover:bg-[#004b87] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Chơi lại
                </button>
                <button
                  onClick={onBackToMenu}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Về màn hình chính
                </button>
              </div>
            </div>
          )}

          {/* OVERLAY: VICTORY SCREEN */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-amber-500/30 text-amber-400 flex items-center justify-center ring-4 ring-amber-400/30 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-amber-300">
                  Chúc mừng!
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-sm">
                  Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
                </p>
              </div>

              {/* Prominent Voucher Code Box */}
              {currentVoucher && (
                <div className="w-full max-w-xs bg-white text-slate-900 rounded-2xl p-4 shadow-xl border-2 border-amber-400 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#005baa]">
                    Mã nhận quà của Quý khách
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#ed1c24] tracking-widest py-1 bg-amber-50 rounded-lg">
                    {currentVoucher}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                {currentVoucher && (
                  <button
                    onClick={() => copyVoucherCode(currentVoucher)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    resetGame();
                    setTimeout(() => startGame(), 100);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#005baa] hover:bg-[#004b87] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Chơi lại
                </button>

                <button
                  onClick={onBackToMenu}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            💡 Mẹo: Nhịp nhảy nhẹ nhàng và căn khoảng giữa các cột trụ vàng để giữ độ cao ổn định.
          </span>
          <span className="font-medium text-[#005baa]">
            Đạt 20 điểm nhận ngay Voucher 2 lít xăng
          </span>
        </div>
      </div>
    </div>
  );
};
