import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaSpotify } from "react-icons/fa";
import { getSpotifyEnabled } from "../services/firestoreService";
import { Tooltip } from "@mui/material";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.4); }
  50% { transform: scale(1.1); opacity: 0.9; box-shadow: 0 0 0 6px rgba(29, 185, 84, 0); }
  100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(29, 185, 84, 0); }
`;

const recordingPulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const WidgetContainer = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: ${(props) => props.theme.body};
  border: 1px solid ${(props) => props.theme.fontColor}22;
  border-radius: 16px;
  text-decoration: none;
  color: ${(props) => props.theme.fontColor};
  transition: all 0.3s ease;
  max-width: 360px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    border-color: ${(props) => (props.$isPlaying ? "#1DB954" : props.theme.fontColor + "44")};
    box-shadow: 0 8px 25px ${(props) => (props.$isPlaying ? "rgba(29, 185, 84, 0.15)" : "rgba(0,0,0,0.1)")};
    text-decoration: none;
    color: ${(props) => props.theme.fontColor};
  }
`;

const AlbumArt = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SpotifyBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  color: #1DB954;
  background: ${(props) => props.theme.body};
  border-radius: 50%;
  padding: 2px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.$isPlaying && css`animation: ${pulse} 2s infinite;`}
  ${(props) => !props.$isPlaying && css`filter: grayscale(100%); opacity: 0.6;`}
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StatusText = styled.div`
  font-size: 0.7rem;
  opacity: ${(props) => (props.$isPlaying ? 1 : 0.6)};
  font-weight: 600;
  margin-bottom: 4px;
  color: ${(props) => (props.$isPlaying ? "#1DB954" : props.theme.fontColor)};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LiveRecordingIcon = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #ef4444; /* Red color for recording/live */
  border-radius: 50%;
  animation: ${recordingPulse} 2s infinite;
  cursor: help;
`;

const SongText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.titleColor};
`;

const ArtistText = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function SpotifyWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    let interval;

    const fetchNowPlaying = async () => {
      try {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const functionUrl = isLocal 
          ? "http://127.0.0.1:5001/jakebates-bb631/us-central1/getSpotifyNowPlaying"
          : "https://us-central1-jakebates-bb631.cloudfunctions.net/getSpotifyNowPlaying";
          
        const response = await fetch(functionUrl);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch Spotify status", error);
      } finally {
        setLoading(false);
      }
    };

    const initializeWidget = async () => {
      try {
        const result = await getSpotifyEnabled();
        if (result.exists() && result.data().spotifyEnabled === false) {
          setIsEnabled(false);
          setLoading(false);
          return;
        }
        setIsEnabled(true);
        await fetchNowPlaying();
        interval = setInterval(fetchNowPlaying, 30000);
      } catch (err) {
        console.error("Error checking Spotify widget settings", err);
        setLoading(false);
      }
    };

    initializeWidget();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!isEnabled || loading || !data || !data.title) {
    return null; 
  }

  return (
    <WidgetContainer $isPlaying={data.isPlaying} href={data.songUrl} target="_blank" rel="noopener noreferrer">
      <AlbumArt>
        {data.albumImageUrl && <img src={data.albumImageUrl} alt={`${data.album} cover`} />}
        <SpotifyBadge $isPlaying={data.isPlaying}>
          <FaSpotify />
        </SpotifyBadge>
      </AlbumArt>
      <TextContainer>
        <StatusText $isPlaying={data.isPlaying}>
          {data.isPlaying ? "Here's what I'm listening to right now 🎧" : "I was recently jamming to 🎵"}
          {data.isPlaying && (
            <Tooltip title="Live! I am listening to this song right this second." arrow placement="top">
              <span><LiveRecordingIcon /></span>
            </Tooltip>
          )}
        </StatusText>
        <SongText>{data.title}</SongText>
        <ArtistText>{data.artist}</ArtistText>
      </TextContainer>
    </WidgetContainer>
  );
}
