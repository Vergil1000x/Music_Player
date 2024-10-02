"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { parseBlob } from "music-metadata-browser";
import { useDropzone } from "react-dropzone";

export default function Music() {
  const [songs, setSongs] = useState([
    {
      id: 1,
      name: "One More Time One More Chance",
      duration: 336,
      albumArt: "/5cpc.jpg",
      audioSrc: "/01OneMoreTimeOneMoreChance.mp3",
    },
    {
      id: 2,
      name: "Waves-Dean Lewis",
      duration: 159,
      albumArt: "/5cpc.jpg",
      audioSrc: "/Dean Lewis - Waves - Lyrics.mp3",
    },
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("0:00");
  const [loopMode, setLoopMode] = useState("no-loop");
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle song metadata extraction
  const handleSongMetadata = async (file: File) => {
    const metadata = await parseBlob(file);
    const albumArt = metadata.common.picture
      ? URL.createObjectURL(new Blob([metadata.common.picture[0].data]))
      : "/5cpc.jpg";
    return {
      name: metadata.common.title || file.name,
      duration: metadata.format.duration || 0,
      albumArt,
      audioSrc: URL.createObjectURL(file),
    };
  };

  // Add new songs via drag-and-drop or file selection
  const onDrop = async (acceptedFiles: File[]) => {
    const newSongs = await Promise.all(
      acceptedFiles.map(async (file) => {
        const songData = await handleSongMetadata(file);
        return {
          id: songs.length + 1,
          ...songData,
        };
      })
    );
    setSongs([...songs, ...newSongs]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav"] },
  });

  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle song end
  const handleSongEnd = () => {
    if (loopMode === "loop-current") {
      audioRef.current?.play();
    } else if (shuffle) {
      playRandomSong();
    } else {
      playNextSong();
    }
  };

  // Play the next song or loop back
  const playNextSong = () => {
    if (shuffle) {
      playRandomSong();
    } else if (currentSongIndex === songs.length - 1) {
      if (loopMode === "loop-all") {
        setCurrentSongIndex(0);
        audioRef.current?.play();
      } else {
        setCurrentSongIndex(0);
        setIsPlaying(false);
      }
    } else {
      setCurrentSongIndex((prevIndex) => prevIndex + 1);
    }
  };

  const playPreviousSong = () => {
    if (shuffle) {
      playRandomSong();
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : songs.length - 1
      );
    }
  };

  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(randomIndex);
  };

  // Handle keyboard events for play/pause
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "k") {
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].audioSrc;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  // Handle progress update
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        setProgress((currentTime / duration) * 100);

        // Update elapsed time
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60)
          .toString()
          .padStart(2, "0");
        setElapsedTime(`${minutes}:${seconds}`);
      }
    };
    audioRef.current?.addEventListener("timeupdate", updateProgress);
    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // Handle seeking using the progress bar
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      const newTime = percentage * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  // Remove song from the queue
  const removeSong = (id: number) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));

    // Adjust current song index if necessary
    if (currentSongIndex >= songs.length - 1) {
      setCurrentSongIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  return (
    <div className="min-h-96 sm:min-w-96 glass rounded-3xl m-1 flex flex-col items-center bg-white p-5">
      {/* Album Artwork */}
      <Image
        src={songs[currentSongIndex].albumArt}
        alt="Album Art"
        width={500}
        height={500}
        className="aspect-square rounded-full w-32 h-32 my-5 object-cover shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
      />

      <h2 className="pb-3 pt-1 drop-shadow-md text-center overflow-hidden max-w-[60vw] relative">
        <div className="absolute h-10 w-10 blur-xl left-0 top-1/2 -translate-y-1/2 z-10" />
        <div
          className={`whitespace-nowrap ${
            songs[currentSongIndex].name.length > 25 ? "scrolling-text" : ""
          }`}
        >
          {songs[currentSongIndex].name}
        </div>
        <div className="absolute h-10 w-10 blur-xl right-0 top-1/2 -translate-y-1/2 z-10" />
      </h2>

      {/* Progress Line */}
      <div
        className="w-full bg-gray-300 h-2 rounded-full relative mb-2 drop-shadow-lg"
        onClick={handleProgressBarClick}
      >
        <div
          className="bg-black h-2 rounded-full shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
          style={{ width: `${progress}%` }} // dynamic width
        ></div>
      </div>

      {/* Timer */}
      <div className="text-center pt-1 pb-2">
        <span>{elapsedTime}</span> /{" "}
        <span>
          {Math.floor(songs[currentSongIndex].duration / 60)}:
          {Math.round(songs[currentSongIndex].duration % 60)
            .toString()
            .padStart(2, "0")}
        </span>
      </div>

      {/* Controls */}
      <div className="flex justify-evenly items-center py-3 gap-6 w-full">
        <button className="control-button" onClick={playPreviousSong}>
          <Image
            src="/previous.png"
            alt="Previous"
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100"
          />
        </button>
        <button
          className="control-button"
          onClick={() => (audioRef.current!.currentTime -= 10)}
        >
          <Image
            src="/backward.png"
            alt="Backward"
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100"
          />
        </button>
        <button className="control-button" onClick={togglePlayPause}>
          <Image
            src={isPlaying ? "/pause.png" : "/play.png"}
            alt={isPlaying ? "Pause" : "Play"}
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100 w-12 h-12"
          />
        </button>
        <button
          className="control-button"
          onClick={() => (audioRef.current!.currentTime += 10)}
        >
          <Image
            src="/forward.png"
            alt="Forward"
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100"
          />
        </button>
        <button className="control-button" onClick={playNextSong}>
          <Image
            src="/next.png"
            alt="Next"
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100"
          />
        </button>
      </div>

      {/* Shuffle and Loop */}
      <div className="flex justify-evenly items-center pb-5 gap-10 w-full">
        <button className="control-button" onClick={() => setShuffle(!shuffle)}>
          <Image
            src={shuffle ? "/shuffle_yes.png" : "/shuffle_no.png"}
            alt="Shuffle"
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100"
          />
        </button>
        <button
          className="control-button"
          onClick={() =>
            setLoopMode(
              loopMode === "no-loop"
                ? "loop-current"
                : loopMode === "loop-current"
                ? "loop-all"
                : "no-loop"
            )
          }
        >
          <Image
            src={
              loopMode === "no-loop"
                ? "/loop_off.png"
                : loopMode === "loop-current"
                ? "/loop_one.png"
                : "/loop_all.png"
            }
            alt="Loop"
            width={24}
            height={24}
            className="drop-shadow-lg scale-95 trns-op2 hover:scale-100"
          />
        </button>
      </div>

      {/* Song Queue */}
      <div className="w-full flex flex-col items-center gap-2">
        <div
          {...getRootProps({
            className:
              "border border-dashed w-full text-center py-7 px-5 rounded-xl drop-shadow-md shadow-xl bg-white/10 hover:bg-white/20 transition-all duration-200",
          })}
        >
          <input {...getInputProps()} />
          <p>Drag & drop some MP3 files here, or click to select files</p>
        </div>
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`p-2 flex justify-between items-center w-full rounded-xl cursor-pointer trns-op hover:scale-100 scale-95 hover:shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] ${
              index === currentSongIndex
                ? "bg-gray-200 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setCurrentSongIndex(index)}
          >
            <Image
              src={song.albumArt}
              alt={song.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-md object-cover"
            />
            <div className="grow justify-between flex px-3">
              <p>
                {song.name.length > 14
                  ? `${song.name.slice(0, 14)}...`
                  : song.name}
              </p>
              <span>
                {Math.floor(song.duration / 60)}:
                {Math.round(song.duration % 60) < 10
                  ? `0${Math.round(song.duration % 60)}`
                  : Math.round(song.duration % 60)}
              </span>
            </div>
            {songs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSong(song.id);
                }}
              >
                <Image
                  src="/cross.png"
                  alt="Remove"
                  width={24}
                  height={24}
                  className="w-4 pr-1"
                />
              </button>
            )}
          </div>
        ))}
      </div>
      <audio
        ref={audioRef}
        onEnded={handleSongEnd}
        onLoadedMetadata={() => setProgress(0)}
      />
    </div>
  );
}
