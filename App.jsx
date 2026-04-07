import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AttendanceStudent from "./components/AttendanceStudent";
import AttendanceTeacher from "./components/AttendanceTeacher";
import Assignment from "./components/Assignment";
import IAManagement from "./components/IAManagement";
import Announcements from "./components/Announcements";
import Resources from "./components/Resources";
import DocumentStorage from "./components/DocumentStorage";
import Certificate from "./components/Certificate";
import Scholarship from "./components/Scholarship";
import Placement from "./components/Placement";
import Email from "./components/Email";
import TeacherAdvice from "./components/TeacherAdvice";
import Payment from "./components/Payment";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [page, setPage] = useState("login");

  const navigate = (feature) => setPage(feature);
  const logout = () => {
    setUser(null);
    setRole("");
    setPage("login");
  };

  if (page === "login")
    return <Login setUser={setUser} setRole={setRole} setPage={setPage} />;

  if (page === "dashboard")
    return <Dashboard user={user} role={role} navigate={navigate} logout={logout} />;

  if (page === "attendance")
    return role === "Teacher" ? (
      <AttendanceTeacher user={user} goBack={() => setPage("dashboard")} />
    ) : (
      <AttendanceStudent user={user} goBack={() => setPage("dashboard")} />
    );

  if (page === "assignments")
    return <Assignment user={user} role={role} goBack={() => setPage("dashboard")} />;

  if (page === "ia")
    return <IAManagement user={user} role={role} goBack={() => setPage("dashboard")} />;

  if (page === "announcements")
    return <Announcements user={user} goBack={() => setPage("dashboard")} />;

  if (page === "resources")
    return <Resources user={user} role={role} goBack={() => setPage("dashboard")} />;

  if (page === "documents")
    return <DocumentStorage role={role} goBack={() => setPage("dashboard")} /> ;

  if (page === "certificate")
    return <Certificate user={user} role={role} goBack={() => setPage("dashboard")} />;

  if (page === "scholarship")
    return <Scholarship user={user} goBack={() => setPage("dashboard")} />;

  if (page === "placement")
    return <Placement user={user} role={role} goBack={() => setPage("dashboard")} />;

  if (page === "email")
    return <Email user={user} goBack={() => setPage("dashboard")} />;

  if (page === "teacherAdvice")
    return <TeacherAdvice user={user} role={role} goBack={() => setPage("dashboard")} />;

  if (page === "payment")
    return <Payment user={user} goBack={() => setPage("dashboard")} />;

  return null;
}

export default App;