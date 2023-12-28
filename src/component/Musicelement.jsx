import React, { useState, useRef, useEffect } from "react";
import "./style/style.css";
import { IoIosRepeat, IoIosShuffle } from "react-icons/io";
import { MdOutlineSkipPrevious, MdOutlineSkipNext } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { LuRepeat1 } from "react-icons/lu";
import imgSrc from "../assets/default.png";
import MusicList from './Musiclist';
const Musicelement = () => {
  const audioRef = useRef(new Audio());
  const [isHovered, setisHovered] = useState(false);
  const [musicDetails, setmusicDetails] = useState(null);
  const [isplay, setisPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [musicListdata, setMusicListdata] = useState('');
const [currentIndex, setCurrentIndex] = useState(0);
const [isrep, setisRep] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setisHovered(true);
  };
  const handleDragLeave = () => {
    setisHovered(false);
  };
  const handleDrop = (event) => {
    setisHovered(false);
    let file = event.dataTransfer.files[0];
    if (file && file.type === "audio/mpeg") {
      uploadAudio(file);
    } else {
      alert("please choose and audio file");
    }
  };

  const uploadAudio = async (file) => {
    try {
      let formdata = new FormData();
      formdata.append("mp3file", file);

      const response = await fetch("http://localhost:8000/uploadsong", {
        method: "POST",
        body: formdata,
      });

      if (response.ok) {
        const data = await response.json();
        setmusicDetails(data);
        audioRef.current.src = `http://localhost:8000/uploads/${data.title}`;

        audioRef.current.addEventListener("loadedmetadata", () => {
          setDuration(audioRef.current.duration);
        });
        audioRef.current.addEventListener("timeupdate", () => {
          setCurrentTime(audioRef.current.currentTime);
        });

        audioRef.current.addEventListener("ended", () => {
          setisPlay(false);
        });
      } else {
        alert("file not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setisPlay(true);
    } else {
      audioRef.current.pause();
      setisPlay(false);
    }
  };

  const formatTime = (time) => {
    let min, sec;
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleProgress = (e) => {
    let progress = e.currentTarget;
    let clickedPos = e.clientX - progress.getBoundingClientRect().left;
    let progressWidth = progress.clientWidth;
    let seekTime = (clickedPos / progressWidth) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
  };

  const fetchList = async () => {
    try {
      let getApi = await fetch(`http://localhost:8000/getItem`);
      let res = await getApi.json();
      setMusicListdata(res)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const selectedSong = (clickedSong) => {
        let audiourl = `http://localhost:8000/uploads/${clickedSong.audioName
    }`;

    audioRef.current.src = audiourl;
    audioRef.current.play();

    setisPlay(true);
    setmusicDetails(clickedSong);

  }


  const nextPlay = () => {
    const nextSong = (currentIndex + 1) % musicListdata.length;
    setCurrentIndex(nextSong);
    selectedSong(musicListdata[nextSong]);
  }
  const prevPlay = () => {
    const prevSong = (currentIndex - 1 + musicListdata.length) % musicListdata.length;
    setCurrentIndex(prevSong);
    selectedSong(musicListdata[prevSong]);
  }


  const toggleRepeat = () => {
    setisRep(!isrep);
  }


  useEffect(() => {
    audioRef.current.loop = isrep;
  }, [isrep])

  return (
    <div className="musicelement">
      <div
        className={`song_picture ${isHovered ? "hoverd" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {musicDetails && (
          <img
            src={
              musicDetails.picture
                ? `data:image/jpeg;base64,${musicDetails.picture}`
                : imgSrc
            }
            alt="coder"
          />
        )}
      </div>

      <div className="progress">
        <div className="time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="progress_bar" onClick={handleProgress}>
          <div
            className="progress_line"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="song_detail">
        <marquee behavior="" direction="">
          {musicDetails && musicDetails.title}
        </marquee>

        <p>{musicDetails && musicDetails.artist}</p>
      </div>

      <div className="controls">
        <button onClick={toggleRepeat}>
          {isrep ? <LuRepeat1/> :  <IoIosRepeat />}
        </button>

        <div className="control_btn">
          <button onClick={prevPlay}>
            <MdOutlineSkipPrevious />
          </button>
          <button className="play_" onClick={handlePlay}>
            {" "}
            {isplay ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={nextPlay}>
            <MdOutlineSkipNext />
          </button>
        </div>

        <button>
          <IoIosShuffle />
        </button>
      </div>
      <MusicList musicListdata = {musicListdata} selectedSong = {selectedSong}/>
    </div>
  );
};

export default Musicelement;
