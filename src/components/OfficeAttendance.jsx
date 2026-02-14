import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getOfficeAttendance,
  setOfficeAttendance,
} from "../services/firestoreService";
import styled from "styled-components";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarCheck,
  FaHistory,
} from "react-icons/fa";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  color: ${(props) => props.theme.fontColor || "#333"};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.titleColor || "#1a1a1a"};
`;

const StatusBadge = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) =>
    props.$compliant ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"};
  color: ${(props) => (props.$compliant ? "#10b981" : "#ef4444")};
  border: 1px solid ${(props) => (props.$compliant ? "#10b981" : "#ef4444")};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${(props) => props.theme.cardBackground || "#fff"};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const StatValue = styled.span`
  font-size: 1.8rem;
  font-weight: 800;
  color: ${(props) => props.theme.titleColor || "#111"};
`;

const StatSub = styled.span`
  font-size: 0.8rem;
  color: #888;
  margin-top: auto;
  padding-top: 0.5rem;
`;

const ActionSection = styled.div`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.primaryColor || "#3b82f6"},
    ${(props) => props.theme.secondaryColor || "#2563eb"}
  );
  border-radius: 20px;
  padding: 2rem;
  color: white;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
`;

const ActionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const PrimaryButton = styled.button`
  background: white;
  color: ${(props) => props.theme.primaryColor || "#2563eb"};
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #e0e0e0;
    color: #888;
  }
`;

const SecondaryAction = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 12px;

  input {
    background: transparent;
    border: none;
    color: white;
    font-family: inherit;
    font-size: 0.9rem;
    color-scheme: dark;

    &:focus {
      outline: none;
    }
  }

  button {
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const WeekCard = styled.div`
  background: ${(props) => props.theme.cardBackground || "#fff"};
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid
    ${(props) =>
      props.$compliant ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  border-left: 4px solid
    ${(props) => (props.$compliant ? "#10b981" : "#ef4444")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const WeekHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const WeekTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.titleColor || "#333"};
`;

const ComplianceTag = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => (props.$compliant ? "#10b981" : "#ef4444")};
  text-transform: uppercase;
`;

const DaysList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DayBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: ${(props) => props.theme.body || "#f3f4f6"};
  border-radius: 6px;
  color: ${(props) => props.theme.fontColor || "#555"};
`;

function OfficeAttendance() {
  const { currentUser } = useAuth();
  const [timestamps, setTimestamps] = useState([]);
  const [dates, setDates] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [complianceStats, setComplianceStats] = useState({
    weeksCompliant: 0,
    status: "Unknown",
    isCompliant: false,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  // Helper to check if two dates are the same day
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  useEffect(() => {
    if (currentUser) {
      getOfficeAttendance(currentUser.uid).then((result) => {
        if (result.exists()) {
          const dateData = result.data().dates || [];
          setTimestamps(dateData);
          setDates(dateData.map((ts) => new Date(ts)));
        } else {
          setOfficeAttendance(currentUser.uid, { dates: [] });
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    calculateWeeks();
  }, [dates]);

  const calculateWeeks = () => {
    const calculatedWeeks = [];
    let weeksCompliantCount = 0;
    const today = new Date();

    for (let i = 0; i < 8; i++) {
      // Calculate Monday of the week
      const d = new Date(today);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(d.setDate(diff - 7 * i));
      monday.setHours(0, 0, 0, 0);

      let presentCount = 0;
      let presentDates = [];

      // Check each day of that week (Mon-Sun)
      for (let j = 0; j < 7; j++) {
        const checkDate = new Date(monday);
        checkDate.setDate(monday.getDate() + j);

        const isPresent = dates.some((date) => isSameDay(date, checkDate));
        if (isPresent) {
          presentCount++;
          presentDates.push(checkDate);
        }
      }

      calculatedWeeks.push({
        string: `Week of ${monday.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
        present: presentCount,
        dates: presentDates,
        startDate: monday,
      });

      if (presentCount >= 2) {
        weeksCompliantCount++;
      }
    }

    setWeeks(calculatedWeeks);

    let statusText = "NOT COMPLIANT";
    let isCompliant = false;

    if (weeksCompliantCount > 4) {
      statusText = "COMPLIANT";
      isCompliant = true;
    } else if (weeksCompliantCount === 4) {
      statusText = "AT MINIMUM";
      isCompliant = true; // Technically 50% is compliant? User's original code said "AT MINIMUM COMPLIANCE" which was orange.
    }

    setComplianceStats({
      weeksCompliant: weeksCompliantCount,
      status: statusText,
      isCompliant: weeksCompliantCount >= 4,
    });
  };

  const logPresence = (dateInput) => {
    const dateObj = new Date(dateInput);
    if (dates.some((d) => isSameDay(d, dateObj))) return;

    const newTimestamps = [...timestamps, dateObj.getTime()];
    const newDates = [...dates, dateObj];

    // Sort needed? Firestore usually handles it but keeping local state consistent is good.
    newTimestamps.sort((a, b) => a - b);
    newDates.sort((a, b) => a - b);

    setTimestamps(newTimestamps);
    setDates(newDates);
    setOfficeAttendance(currentUser.uid, { dates: newTimestamps });
  };

  const handleLogToday = () => {
    logPresence(new Date());
  };

  const handleLogPastDate = () => {
    if (selectedDate) {
      logPresence(selectedDate);
      setSelectedDate(null); // Reset after log
    }
  };

  const isTodayLogged = dates.some((d) => isSameDay(d, today));
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  return (
    <Container>
      <Header>
        <Title>Office Attendance</Title>

        <StatusBadge $compliant={complianceStats.isCompliant}>
          {complianceStats.isCompliant ? <FaCheckCircle /> : <FaTimesCircle />}
          {complianceStats.status}
        </StatusBadge>
      </Header>
      <ActionSection>
        <ActionTitle>Log Your Attendance</ActionTitle>
        <ButtonGroup>
          <PrimaryButton
            onClick={handleLogToday}
            disabled={isTodayLogged || isWeekend}
          >
            <FaCalendarCheck />
            {isTodayLogged
              ? "Logged for Today"
              : isWeekend
                ? "Weekend"
                : "Log Today's Attendance"}
          </PrimaryButton>

          <SecondaryAction>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                    ? new Date(e.target.value + "T12:00:00")
                    : null,
                )
              }
            />
            <button onClick={handleLogPastDate} disabled={!selectedDate}>
              Log Date
            </button>
          </SecondaryAction>
        </ButtonGroup>
      </ActionSection>

      <StatsGrid>
        <StatCard>
          <StatLabel>8-Week Compliance</StatLabel>
          <StatValue>{complianceStats.weeksCompliant} / 8</StatValue>
          <StatSub>Weeks with 2+ days</StatSub>
        </StatCard>
        <StatCard>
          <StatLabel>Total Days Logged</StatLabel>
          <StatValue>{timestamps.length}</StatValue>
          <StatSub>All time</StatSub>
        </StatCard>
        <StatCard>
          <StatLabel>This Week</StatLabel>
          <StatValue>{weeks[0]?.present || 0}</StatValue>
          <StatSub>Days logged so far</StatSub>
        </StatCard>
      </StatsGrid>

      <Header>
        <Title as="h2" style={{ fontSize: "1.5rem" }}>
          History
        </Title>
        <div
          style={{
            color: "#888",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FaHistory /> Last 8 Weeks
        </div>
      </Header>

      <HistoryGrid>
        {weeks.map((week, index) => (
          <WeekCard key={index} $compliant={week.present >= 2}>
            <WeekHeader>
              <WeekTitle>{week.string}</WeekTitle>
              <ComplianceTag $compliant={week.present >= 2}>
                {week.present >= 2 ? "Pass" : "Fail"}
              </ComplianceTag>
            </WeekHeader>
            <DaysList>
              {week.dates.length > 0 ? (
                week.dates.map((date, i) => (
                  <DayBadge key={i}>
                    <FaCheckCircle color="#10b981" />
                    {date.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </DayBadge>
                ))
              ) : (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#999",
                    fontStyle: "italic",
                  }}
                >
                  No entries this week
                </span>
              )}
            </DaysList>
          </WeekCard>
        ))}
      </HistoryGrid>
    </Container>
  );
}

export default OfficeAttendance;
