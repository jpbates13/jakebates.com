import React from "react";
import { useState, useEffect } from "react";
import { getBlogEnabled, updateBlogEnabled, getSpotifyEnabled, updateSpotifyEnabled } from "../services/firestoreService";

function Settings() {
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [spotifyEnabled, setSpotifyEnabled] = useState(true);

  useEffect(() => {
    getBlogEnabled().then((result) => {
      if (result.exists()) {
        setBlogEnabled(result.data().blogEnabled);
      } else {
        console.log("No such document for blogEnabled!");
      }
    });

    getSpotifyEnabled().then((result) => {
      if (result.exists()) {
        setSpotifyEnabled(result.data().spotifyEnabled);
      } else {
        console.log("No such document for spotifyEnabled!");
        // Initialize to true if doesn't exist
        updateSpotifyEnabled(true);
      }
    });
  }, []);

  function handleBlogEnabledChange() {
    updateBlogEnabled(!blogEnabled).catch((err) => {
      console.log(err);
    });
    setBlogEnabled(!blogEnabled);
  }

  function handleSpotifyEnabledChange() {
    updateSpotifyEnabled(!spotifyEnabled).catch((err) => {
      console.log(err);
    });
    setSpotifyEnabled(!spotifyEnabled);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: "1rem" }}>
        <div style={{ marginRight: "10px", width: "180px" }}>Enable Blog: </div>
        <div>
          <input
            type="checkbox"
            checked={blogEnabled}
            onChange={handleBlogEnabledChange}
          ></input>
        </div>
      </div>
      
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <div style={{ marginRight: "10px", width: "180px" }}>Enable Spotify Widget: </div>
        <div>
          <input
            type="checkbox"
            checked={spotifyEnabled}
            onChange={handleSpotifyEnabledChange}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default Settings;
