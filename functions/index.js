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
