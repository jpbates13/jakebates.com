import React from "react";
import { useAuth } from "../contexts/AuthContext";
import db from "../firebase";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { get } from "firebase/database";
import { Tooltip } from "@mui/material";
import redX from "../images/svg/icons8-x.svg";
import greenCheck from "../images/svg/icons8-check.svg";

function OfficeAttendance() {
  const { currentUser, logout } = useAuth();
  const [dates, setDates] = useState([]);
  const [todayLogged, setTodayLogged] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [inCompliance, setInCompliance] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const docRef = doc(db, "office-attendance", currentUser.uid);
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        let dateData = result.data().dates;
        setDates([...dateData]);
      } else {
        // doc.data() will be undefined in this case, new user probably
        console.log("No such document!");
        const docRef = doc(db, "office-attendance", currentUser.uid);
        //could add error handling here
        setDoc(docRef, { dates: [] });
      }
    });
  }, []);

  useEffect(() => {
    //check if a date from today is in the dates array
    let today = new Date();
    let todayLogged = dates.some((date) => {
      let dateObj = new Date(date);
      console.log(dateObj);
      return (
        dateObj.getFullYear() === today.getFullYear() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getDate() === today.getDate()
      );
    });
    setTodayLogged(todayLogged);
    setWeeks(getWeeks());
  }, [dates]);

  const logPresence = (date) => {
    const docRef = doc(db, "office-attendance", currentUser.uid);
    const newDates = [...dates, date];
    setDoc(docRef, { dates: newDates });
    setDates(newDates);
  };
  const getWeeks = () => {
    const today = new Date();
    const weeks = [];
    let weeksCompliant = 0;
    for (let i = 0; i < 8; i++) {
      const monday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 1 - 7 * i
      );
      const sunday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 7 - 7 * i
      );

      let present = 0;
      let dateArray = [];
      for (let j = 0; j < 7; j++) {
        //skip weekends
        if (j === 5 || j === 6) {
          continue;
        }
        const day = new Date(monday);
        day.setDate(day.getDate() + j);
        if (dates.includes(day.toDateString())) {
          present++;
          dateArray.push(day.toDateString());
        }
      }
      weeks.push({
        string: `Week of ${monday.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}`,
        present: present,
        dates: dateArray,
      });
      if (present >= 2) {
        weeksCompliant++;
      }
    }
    if (weeksCompliant >= 4) {
      setInCompliance(true);
    } else {
      setInCompliance(false);
    }
    return weeks;
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginRight: "10px", marginBottom: "40px" }}>
          <Button
            onClick={() => {
              const today = new Date();
              logPresence(today.toDateString());
            }}
            disabled={
              todayLogged || today.getDay() === 5 || today.getDay() === 6
            }
            size="lg"
          >
            Log Today
          </Button>
        </div>
        <div>
          <div>
            <input
              type="date"
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setSelectedDate(selectedDate);
              }}
              value={selectedDate.toISOString().split("T")[0]}
            />
            <br />
            <Button
              onClick={() => {
                logPresence(selectedDate.toDateString());
              }}
              disabled={
                dates.includes(selectedDate.toDateString()) ||
                selectedDate > new Date() ||
                selectedDate.getDay() === 5 ||
                selectedDate.getDay() === 6 ||
                selectedDate == null
              }
              defaultValue={new Date()}
              size="sm"
            >
              Log Date
            </Button>
          </div>
        </div>
      </div>
      <p
        style={{
          color: inCompliance ? "green" : "red",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        STATUS: {inCompliance ? "COMPLIANT" : "UNCOMPLIANT"}
      </p>

      <table style={{ margin: "auto" }}>
        {weeks.map((week, index) => (
          <tr>
            <td style={{ textAlign: "left" }}>
              <p
                key={index}
                style={{
                  marginRight: "25px",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                {week.string}
              </p>
            </td>
            <td>
              <div>
                {week.dates.map((i) => (
                  <Tooltip title={i} arrow>
                    <img
                      src={greenCheck}
                      style={{ width: "45px", height: "45px" }}
                    />
                  </Tooltip>
                ))}
                {week.dates.length < 2 &&
                  Array.from({ length: 2 - week.dates.length }).map(
                    (_, index) => (
                      <Tooltip title="No entry" arrow>
                        <img
                          src={redX}
                          style={{ width: "45px", height: "45px" }}
                          key={index}
                        />
                      </Tooltip>
                    )
                  )}
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default OfficeAttendance;
