const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

admin.initializeApp();

exports.addSocialTags = functions.https.onRequest(async (req, res) => {
  const postId = req.query.post;

  if (!postId) {
    res.status(400).send("Missing post ID");
    return;
  }

  try {
    const postSnapshot = await admin.firestore().collection("posts").doc(postId).get();
    
    // We copy index.html to the functions directory during deployment
    const indexPath = path.resolve(__dirname, "./index.html");
    
    let html = fs.readFileSync(indexPath, "utf8");

    if (postSnapshot.exists) {
      const post = postSnapshot.data();
      const title = post.title || "JakeBates.com";
      const description = post.summary || "A blog post by Jake Bates";
      const image = post.imageUrl || "https://jakebates.com/logo512.png"; // Fallback image

      // Replace title
      html = html.replace(/<title>.*<\/title>/, `<title>${title} | JakeBates.com</title>`);
      
      // Inject Open Graph and Twitter tags
      // We look for the head closing tag `</head>` and prepend our tags
      const metaTags = `
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="description" content="${description}" />
      `;
      
      html = html.replace("</head>", `${metaTags}</head>`);
    } else {
        // If post doesn't exist, we just return the default HTML which will let React handle the 404 or empty state
        // You might definitely want to set a default title though.
        console.log("Post not found:", postId);
    }

    // Set cache control headers to avoid aggressive caching of the HTML by social crawlers/browsers if needed
    // res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    res.status(200).send(html);

  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.getSpotifyNowPlaying = functions.https.onRequest(async (req, res) => {
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://jakebates.com', 'https://www.jakebates.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }

  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) {
    res.status(500).json({ error: "Missing Spotify credentials in environment" });
    return;
  }

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64")
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token
      })
    });
    
    if (!tokenResponse.ok) {
        throw new Error("Failed to get Spotify access token");
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const playingResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    });

    if (playingResponse.status === 204 || playingResponse.status > 400) {
      const recentResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
        headers: { "Authorization": "Bearer " + accessToken }
      });
      
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        if (recentData.items && recentData.items.length > 0) {
          const track = recentData.items[0].track;
          const song = {
            isPlaying: false,
            title: track.name,
            artist: track.artists.map((_artist) => _artist.name).join(", "),
            album: track.album.name,
            albumImageUrl: track.album.images[0]?.url,
            songUrl: track.external_urls.spotify
          };
          res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
          return res.status(200).json(song);
        }
      }
      return res.status(200).json({ isPlaying: false });
    }

    const playingData = await playingResponse.json();

    if (playingData.currently_playing_type !== "track") {
      const recentResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
        headers: { "Authorization": "Bearer " + accessToken }
      });
      
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        if (recentData.items && recentData.items.length > 0) {
          const track = recentData.items[0].track;
          const song = {
            isPlaying: false,
            title: track.name,
            artist: track.artists.map((_artist) => _artist.name).join(", "),
            album: track.album.name,
            albumImageUrl: track.album.images[0]?.url,
            songUrl: track.external_urls.spotify
          };
          res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
          return res.status(200).json(song);
        }
      }
      return res.status(200).json({ isPlaying: false });
    }

    const song = {
      isPlaying: playingData.is_playing,
      title: playingData.item.name,
      artist: playingData.item.artists.map((_artist) => _artist.name).join(", "),
      album: playingData.item.album.name,
      albumImageUrl: playingData.item.album.images[0]?.url,
      songUrl: playingData.item.external_urls.spotify
    };

    res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    res.status(200).json(song);
  } catch (error) {
    console.error("Spotify API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
