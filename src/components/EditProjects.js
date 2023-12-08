import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import { updateDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";

const EditProjects = () => {

    const [projects, setProjects] = useState([])
    const [toDelete, setToDelete] = useState([])

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
            title: "",
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
        setProjects(list);
    }

    return (
        <div className="edit-projects">
            {projects.map((project, index) => (
                <div key={index} className="edit-project">
                    <p className="project-title">{project.title}</p>
                    <input
                        className="project-input"
                        placeholder="Date"
                        type="text"
                        value={project.date}
                        onChange={(e) => handleDateChange(e, index)}
                    />
                    <textarea
                        className="project-input"
                        placeholder="Description"
                        value={project.description}
                        onChange={(e) => handleDescriptionChange(e, index)}
                    ></textarea>
                    <input
                        className="project-input"
                        placeholder="Repository"
                        type="text"
                        value={project.repository}
                        onChange={(e) => handleRepositoryChange(e, index)}
                    />
                    <button
                        className="delete-button"
                        onClick={(e) => deleteProject(index)}
                    >
                        Delete Project
                    </button>
                </div>
            ))}
            <div className="button-container">
                <button className="submit-button" onClick={handleSubmit}>
                    Submit
                </button>
                <button className="add-button" onClick={addProject}>
                    Add Project
                </button>
            </div>
        </div>
    );
};

export default EditProjects;
