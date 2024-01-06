import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import { updateDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";
import Modal from "./Modal";
import { FormLabel } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FaCheck, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EditProjects = () => {
  const [projects, setProjects] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectData = [];
      querySnapshot.forEach((doc) => {
        projectData.push(doc.data());
      });
      console.log(projectData);
      setProjects(projectData);
    });
    return () => unsubscribe();
  }, []);

  const handleShowModal = (show, index) => {
    setShowModal(show);
    setCurrentProject(index);
  };

  const handleDateChange = (e, index) => {
    const { value } = e.target;
    const list = [...projects];
    list[index].date = value;
    setProjects(list);
  };

  const handleDescriptionChange = (e, index) => {
    const { value } = e.target;
    const list = [...projects];
    list[index].description = value;
    setProjects(list);
  };

  const handleRepositoryChange = (e, index) => {
    const { value } = e.target;
    const list = [...projects];
    list[index].repository = value;
    setProjects(list);
  };

  const handleSubmit = async () => {
    // write to firestore
    const batch = writeBatch(db);
    const projectRef = collection(db, "projects");
    projects.forEach((project, index) => {
      const projectDoc = doc(projectRef, project.title);
      batch.set(projectDoc, project);
    });
    await batch.commit();

    console.log(toDelete);
    // delete projects
    const deleteBatch = writeBatch(db);
    const deleteRef = collection(db, "projects");
    toDelete.forEach((project, index) => {
      const projectDoc = doc(deleteRef, project);
      deleteBatch.delete(projectDoc);
    });
    await deleteBatch.commit();

    navigate("/");
  };

  const addProject = () => {
    const list = [...projects];
    list.push({
      title: newProjectTitle,
      date: "",
      description: "",
      repository: "",
    });
    setProjects(list);
  };

  const deleteProject = async (index) => {
    setToDelete([...toDelete, projects[index].title]);
    const list = [...projects];

    // Remove the project from the local state
    list.splice(index, 1);

    Promise.resolve()
      .then(() => {
        setCurrentProject(null);
      })
      .then(() => setProjects(list));

    setShowModal(false);
  };

  return (
    <>
      {!projects && <div>Loading...</div>}

      {projects && (
        <div>
          <Modal
            isOpen={showModal}
            handleClose={() => {
              handleShowModal(false, 0);
            }}
          >
            {currentProject != null && (
              <div>
                <h3>{projects[currentProject].title}</h3>
                <input
                  className="project-input"
                  placeholder="Date"
                  type="text"
                  value={projects[currentProject].date}
                  onChange={(e) => handleDateChange(e, currentProject)}
                />
                <textarea
                  className="project-input"
                  placeholder="Description"
                  value={projects[currentProject].description}
                  onChange={(e) => handleDescriptionChange(e, currentProject)}
                  rows={7}
                ></textarea>
                <input
                  className="project-input"
                  placeholder="Repository"
                  type="text"
                  value={projects[currentProject].repository}
                  onChange={(e) => handleRepositoryChange(e, currentProject)}
                />
                <p />
                <div
                  className="button-container"
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div
                    className="ok-project"
                    onClick={(e) => {
                      handleShowModal(false, 0);
                    }}
                  >
                    <IconContext.Provider
                      value={{
                        color: "#FFF",
                      }}
                    >
                      <FaCheck />
                    </IconContext.Provider>
                  </div>
                  <div
                    className="delete-button"
                    onClick={(e) => deleteProject(currentProject)}
                  >
                    <IconContext.Provider
                      value={{
                        color: "#FFF",
                      }}
                    >
                      <FaTrash />
                    </IconContext.Provider>
                  </div>
                </div>
              </div>
            )}
          </Modal>
          <ul className="project-list">
            {projects.map((project, index) => (
              <>
                <li key={index}>
                  <p
                    className="project-title"
                    onClick={() => {
                      handleShowModal(true, index);
                    }}
                  >
                    {project.title}
                  </p>
                </li>
              </>
            ))}
            <li>
              <input
                className="new-project-input"
                placeholder="New Project Title"
                type="text"
                onChange={(e) => setNewProjectTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addProject();
                }}
              />
            </li>
          </ul>

          <div className="button-container">
            <Button className="submit-button" onClick={handleSubmit}>
              Submit
            </Button>{" "}
            <Button
              className="add-button"
              onClick={addProject}
              disabled={newProjectTitle == null || newProjectTitle == ""}
            >
              Add Project
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProjects;
