import React from "react";
import { useAuth } from "../contexts/AuthContext";
import db from "../firebase";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { get, set } from "firebase/database";
import { Tooltip } from "@mui/material";
import redX from "../images/svg/icons8-x.svg";
import greenCheck from "../images/svg/icons8-check.svg";
import { check } from "prettier";

function OfficeAttendance() {
  const { currentUser, logout } = useAuth();
  const [dates, setDates] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [inCompliance, setInCompliance] = useState({weeks: 0, color: "red", text: "Not in compliance"});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [today, setToday] = useState(new Date());

  const checkDateEquality = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    const docRef = doc(db, "office-attendance", currentUser.uid);
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        let dateData = result.data().dates;

        if (dateData === null || dateData === undefined) {
          dateData = [];
        }

        setTimestamps([...dateData]);
        //convert the timestamps to dates
        let parsedDates = [];
        dateData = dateData.map((timestamp) => {
          let date = new Date(timestamp);
          parsedDates.push(date);
        });
        setDates([...parsedDates]);
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
    setWeeks(getWeeks());
  }, [dates]);

  const logPresence = (date) => {
    const docRef = doc(db, "office-attendance", currentUser.uid);
    const parsedDate = new Date(date);
    const newTimestamps = [...timestamps, date];
    const newDates = [...dates, parsedDate];
    setDoc(docRef, { dates: newTimestamps });
    setDates(newDates);
    setTimestamps(newTimestamps);
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

      let present = 0;
      let dateArray = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(monday);
        day.setDate(day.getDate() + j);
        if (
          dates.some((date) => {
            return checkDateEquality(day, date);
          })
        ) {
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

    if (weeksCompliant > 4) {
      setInCompliance({weeks: weeksCompliant, color: "green", text: "COMPLIANT"});
    } else if (weeksCompliant == 4) {
      setInCompliance({weeks: weeksCompliant, color: "darkorange", text: "AT MINIMUM COMPLIANCE"});
    } else {
      setInCompliance({weeks: weeksCompliant, color: "red", text: "NOT IN COMPLIANCE"});
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
              logPresence(today.getTime());
            }}
            disabled={
              today.getDay() === 0 || 
              today.getDay() === 6 ||  
              timestamps.some(time => {
                return checkDateEquality(new Date(time), today)
              })
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
                const selectedDateInput = new Date(
                  e.target.value + "T00:00:00"
                );
                setSelectedDate(selectedDateInput);
              }}
            />
            <br />
            <Button
              onClick={() => {
                logPresence(selectedDate.getTime());
              }}
              disabled={
                selectedDate > new Date() ||
                selectedDate.getDay() === 0 ||
                selectedDate.getDay() === 6 ||
                selectedDate == null ||
                timestamps.some(time => {
                  return checkDateEquality(new Date(time), selectedDate)
                })
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
          color: inCompliance.color,
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        STATUS: {inCompliance.text}
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
