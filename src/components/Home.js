import React from "react";
import Headshot from "../images/headshot.png";
import Resume from "../assets/resume.pdf";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

export default function Home() {

  const [bio, setBio] = useState("")

  useEffect(() => {
    const docRef = doc(db, "content", "bio");
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        setBio(result.data().content);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }, []);


  return (
    <div>
      <Helmet>
        <title>JakeBates.com | Home</title>
      </Helmet>
      <div class="row d-flex h-100">
        <div class="headshot col-md-6 justify-content-center">
          <div class="block second">
            <br />
            <img
              style={{ minWidth: "70%", maxWidth: "70%", height: "auto" }}
              class="img-fluid"
              src={Headshot}
              alt="Headshot of Jake"
            />
          </div>
        </div>
        <div class="bio col-md-6 align-middle text-left hidden-sm align-self-auto">
          <div class="block first">
            <p>{bio}{" "}
              You can check
              out more of my resume <a href={Resume}>here</a> and my personal
              projects <a href="https://github.com/jpbates13">here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
