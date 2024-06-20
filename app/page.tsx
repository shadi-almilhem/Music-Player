"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
const songs = [
  {
    name: "2 days into collage",
    src: "/assets/songs/2 days into college.mp3",
    cover: "/assets/songs/TwoDaysIntoCollage.webp",
    artist: "Aimee Carty",
  },
  {
    name: "redrum",
    src: "/assets/songs/21 Savage - redrum.mp3",
    cover: "/assets/songs/redrum.webp",
    artist: "21 Savage",
  },
  {
    name: "Pocket Locket",
    src: "/assets/songs/Alaina Castillo - Pocket Locket.mp3",
    cover: "/assets/songs/pocketLocket.webp",
    artist: "Alaina Castillo",
  },
  {
    name: "Cool With You",
    src: "/assets/songs/NewJeans Cool With You.mp3",
    cover: "/assets/songs/CoolWithYou.webp",
    artist: "NewJeans",
  },
  {
    name: "How Sweet",
    src: "/assets/songs/NewJeans How Sweet.mp3",
    cover: "/assets/songs/HowSweet.webp",
    artist: "NewJeans",
  },
  {
    name: "One Of The Girls",
    src: "/assets/songs/The Weeknd, JENNIE, Lily-Rose Depp - One Of The Girls.mp3",
    cover: "/assets/songs/OneOfTheGirls.webp",
    artist: "The Weeknd, JENNIE, Lily-Rose Depp",
  },
  {
    name: "Save Your Tears",
    src: "/assets/songs/The Weeknd - Save Your Tears.mp3",
    cover: "/assets/songs/SaveYourTears.webp",
    artist: "The Weeknd",
  },
];
export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentSongIndex");
    if (savedIndex !== null && !isNaN(Number(savedIndex))) {
      const index = Number(savedIndex);
      if (index >= 0 && index < songs.length) {
        setCurrentSongIndex(index);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("currentSongIndex", currentSongIndex.toString());
    }
  }, [currentSongIndex, isInitialized]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const setAudioData = () => {
        setDuration(audioElement.duration);
        setCurrentTime(audioElement.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audioElement.currentTime);

      audioElement.addEventListener("loadeddata", setAudioData);
      audioElement.addEventListener("timeupdate", setAudioTime);

      // Initialize the duration when the component mounts
      if (audioElement.readyState >= 2) {
        setDuration(audioElement.duration);
      }

      return () => {
        audioElement.removeEventListener("loadeddata", setAudioData);
        audioElement.removeEventListener("timeupdate", setAudioTime);
      };
    }
  }, [currentSongIndex]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        audioRef.current.play();
        lastTimestampRef.current = null; // Reset last timestamp
        startSpinning();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);

    setIsPlaying(true);

    resetRotation();
    startSpinning();
  };

  const handlePrev = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length,
    );

    setIsPlaying(true);
    resetRotation();
    startSpinning();
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(event.target.value);
    }
  };

  const resetRotation = () => {
    setRotationAngle(0);
    if (discRef.current) {
      discRef.current.style.transform = `rotate(0deg)`;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const startSpinning = () => {
    const spin = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const elapsed = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      const increment = (360 / 60) * (elapsed / 1000); // Rotate at 60 RPM
      setRotationAngle((prevAngle) => {
        const newAngle = (prevAngle + increment) % 360;
        if (discRef.current) {
          discRef.current.style.transform = `rotate(${newAngle}deg)`;
        }
        return newAngle;
      });

      animationRef.current = requestAnimationFrame(spin);
    };
    animationRef.current = requestAnimationFrame(spin);
  };

  const currentSong = songs[currentSongIndex];

  return (
    <main className="flex h-screen items-center justify-center bg-black/95">
      <div className="relative m-4 w-[400px] overflow-hidden rounded-xl border-2 bg-gradient-to-b from-gray-800 to-gray-900">
        <Link
          target="_blank"
          href="https://shadialmilhem.com"
          className="triangle absolute bottom-0 right-0  bg-red-500"
        ></Link>
        <div className="mt-2 flex h-[10vh] w-full items-center justify-center gap-4 py-2">
          <Link
            className="flex h-full "
            target="_blank"
            href="https://shadialmilhem.com"
          >
            <Image
              src="/SH-logo.png"
              alt="Shadi Al Milhem Logo"
              width={500}
              height={500}
              className="h-auto w-auto rounded-full"
            />
          </Link>
          <h3 className="text-2xl font-semibold text-gray-200">
            My Favorite Songs
          </h3>
        </div>
        <div className="flex h-[70vh] flex-col items-center justify-between gap-4">
          <div
            className="vinyl-disc scale-75 md:scale-100"
            style={{ backgroundImage: `url(${currentSong.cover})` }}
            ref={discRef}
          ></div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-200">
              {currentSong.name}
            </h1>
            <h2 className="text-lg font-medium text-gray-400">
              {currentSong.artist}
            </h2>
          </div>
          <audio
            ref={audioRef}
            src={currentSong.src}
            onEnded={handleNext}
            autoPlay
          />
          <div className="flex w-full flex-col items-center justify-center px-4">
            <input
              type="range"
              className="transparent mx-4 h-[4px]  w-full cursor-pointer  border-transparent bg-neutral-200 accent-purple-500"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSliderChange}
            />
            <div className="mt-2 flex w-full items-center justify-between">
              <span className="text-gray-400">
                {Math.floor(currentTime / 60)}:
                {("0" + Math.floor(currentTime % 60)).slice(-2)}
              </span>

              <span className="text-gray-400">
                {Math.floor(duration / 60)}:
                {("0" + Math.floor(duration % 60)).slice(-2)}
              </span>
            </div>
          </div>

          <div className="mb-8 flex gap-14">
            <Button
              className="h-[60px] w-[60px] rounded-full bg-transparent"
              onClick={handlePrev}
            >
              <ChevronLeft />
            </Button>
            <Button
              className="h-[65px] w-[65px] rounded-full bg-gradient-to-b from-gray-50 to-gray-300"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause fill="#222222" strokeWidth={0} color="#222222" />
              ) : (
                <Play strokeWidth={2.5} color="#222222" />
              )}
            </Button>
            <Button
              className="h-[60px] w-[60px] rounded-full bg-transparent"
              onClick={handleNext}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
