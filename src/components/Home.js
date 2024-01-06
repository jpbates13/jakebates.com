import React from "react";
import Headshot from "../images/headshot.png";
import Resume from "../assets/resume.pdf";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

export default function Home() {

  const [bio, setBio] = useState("")

  function getResume() {
    //get resume from firebase
    const docRef = doc(db, "resume", "resume");
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        openBase64PDFInNewTab(result.data().base64);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }

  function openBase64PDFInNewTab(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const newTab = window.open();
    newTab.document.write(
      '<iframe src="' +
        url +
        '" style="width:100%; height:100%;" frameborder="0"></iframe>'
    );
  }

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
      <div class="row d-flex h-100 homepage-content">
        <div class="headshot col-lg-6 justify-content-center">
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
        <div class="bio col-lg-6 align-middle text-left hidden-sm align-self-auto">
          <div class="block first">
            <p>{bio}{" "}
              You can check
              out more of my resume <a onClick={getResume} href="#">here</a> and my personal
              projects <a href="https://github.com/jpbates13">here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
