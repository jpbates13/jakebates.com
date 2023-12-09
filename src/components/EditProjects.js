import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import { updateDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";
import Modal from "./Modal";


const EditProjects = () => {

    const [projects, setProjects] = useState([])
    const [toDelete, setToDelete] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [newProjectTitle, setNewProjectTitle] = useState(null);


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
    }

    const handleDateChange = (e, index) => {
        const { value } = e.target;
        const list = [...projects];
        list[index].date = value;
        setProjects(list);
    }

    const handleDescriptionChange = (e, index) => {
        const { value } = e.target;
        const list = [...projects];
        list[index].description = value;
        setProjects(list);
    }

    const handleRepositoryChange = (e, index) => {
        const { value } = e.target;
        const list = [...projects];
        list[index].repository = value;
        setProjects(list);
    }

    const handleSubmit = async () => {
        // write to firestore
        const batch = writeBatch(db);
        const projectRef = collection(db, "projects");
        projects.forEach((project, index) => {
            const projectDoc = doc(projectRef, project.title);
            batch.set(projectDoc, project);
        });
        await batch.commit();

        console.log(toDelete)
        // delete projects
        const deleteBatch = writeBatch(db);
        const deleteRef = collection(db, "projects");
        toDelete.forEach((project, index) => {
            const projectDoc = doc(deleteRef, project);
            deleteBatch.delete(projectDoc);
        });
        await deleteBatch.commit();
    }

    const addProject = () => {
        const list = [...projects];
        list.push({
            title: newProjectTitle,
            date: "",
            description: "",
            repository: ""
        })
        setProjects(list);
    }

    const deleteProject = async (index) => {
        setToDelete([...toDelete, projects[index].title]);
        const list = [...projects];

        // Remove the project from the local state
        list.splice(index, 1);

        Promise.resolve()
        .then(() => { setCurrentProject(null)})
        .then(() => setProjects(list))

        setShowModal(false)
    }



    return (
        <>
            {!projects && <div>Loading...</div>}

            {projects && <div>
                <Modal
                    isOpen={showModal}
                    handleClose={() => {
                        handleShowModal(false, 0);
                    }}
                >
                    {currentProject != null &&
                        <div style={{display: "flex", justifyContent: "space-around"}}>
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
                            ></textarea>
                            <input
                                className="project-input"
                                placeholder="Repository"
                                type="text"
                                value={projects[currentProject].repository}
                                onChange={(e) => handleRepositoryChange(e, currentProject)}
                            />
                            <button
                                className="delete-button"
                                onClick={(e) => deleteProject(currentProject)}
                            >
                                Delete Project
                            </button>
                        </div>
                    }
                </Modal>
                <ul>
                    {projects.map((project, index) => (
                        <>
                            <li key={index}>
                                <p className="project-title" onClick={() => { handleShowModal(true, index) }}>{project.title}</p>
                            </li>
                        </>
                    ))}
                </ul>
                <input
                    className="new-project-input"
                    placeholder="New Project Title"
                    type="text"
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                />
                <div className="button-container">
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="add-button" onClick={addProject} disabled={newProjectTitle == null || newProjectTitle == ""}>
                        Add Project
                    </button>
                </div>


            </div>}
        </>
    );
};

export default EditProjects;
