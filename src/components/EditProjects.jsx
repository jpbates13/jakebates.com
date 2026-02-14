import React, { useState, useEffect } from "react";
import {
  subscribeToProjects,
  saveProjects,
} from "../services/firestoreService";
import Modal from "./Modal";
import styled from "styled-components";
import {
  FaPlus,
  FaGithub,
  FaCalendar,
  FaCode,
  FaLaptopCode,
  FaTrash,
  FaSave,
} from "react-icons/fa";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ProjectCard = styled.div`
  background: ${(props) => props.theme.cardBackground || "#fff"};
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme.linkColor};
  }
`;

const NewProjectCard = styled(ProjectCard)`
  border: 2px dashed ${(props) => props.theme.fontColor}33;
  background: transparent;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${(props) => props.theme.fontColor}99;

  &:hover {
    border-color: ${(props) => props.theme.linkColor};
    color: ${(props) => props.theme.linkColor};
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme.titleColor};
`;

const Badge = styled.span`
  font-size: 0.75rem;
  background: ${(props) => props.theme.linkColor}1a;
  color: ${(props) => props.theme.linkColor};
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 1rem;
  width: fit-content;
  text-transform: capitalize;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${(props) => props.theme.fontColor}99;
  margin-bottom: 0.25rem;

  svg {
    opacity: 0.7;
  }
`;

const Button = styled.button`
  background: ${(props) => props.theme.linkColor};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &.danger {
    background: #ef4444;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: ${(props) => props.theme.fontColor};
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.fontColor}33;
    background: ${(props) => props.theme.body};
    color: ${(props) => props.theme.fontColor};
    font-family: inherit;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.linkColor};
    }
  }
`;

const ModalContent = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.body};
  color: ${(props) => props.theme.fontColor};
  border-radius: 12px;
`;

const EditProjects = () => {
  const [projects, setProjects] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Temporary state for the project being edited
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    description: "",
    repository: "",
    tech_stack: "",
    type: "personal",
  });

  useEffect(() => {
    const unsubscribe = subscribeToProjects((querySnapshot) => {
      const projectData = [];
      querySnapshot.forEach((doc) => {
        projectData.push(doc.data());
      });
      setProjects(projectData);
    });
    return () => unsubscribe();
  }, []);

  const openEditModal = (index) => {
    setEditingIndex(index);
    setEditFormData({ ...projects[index] });
    setShowModal(true);
  };

  const openNewModal = () => {
    setEditingIndex(-1); // -1 indicates new project
    setEditFormData({
      title: "",
      date: "",
      description: "",
      repository: "",
      tech_stack: "",
      type: "personal",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveModal = () => {
    const list = [...projects];
    if (editingIndex === -1) {
      // Add new
      list.push(editFormData);
    } else {
      // Update existing
      list[editingIndex] = editFormData;
    }
    setProjects(list);
    setShowModal(false);
  };

  const handleGlobalSave = async () => {
    try {
      if (
        window.confirm(
          "Are you sure you want to save all changes to Firestore?",
        )
      ) {
        await saveProjects(projects, toDelete);
        alert("Projects saved successfully!");
      }
    } catch (error) {
      console.error("Error saving projects:", error);
      alert("Failed to save projects.");
    }
  };

  const deleteProject = () => {
    if (editingIndex === -1) {
      setShowModal(false);
      return;
    }

    if (window.confirm(`Delete "${projects[editingIndex].title}"?`)) {
      setToDelete([...toDelete, projects[editingIndex].title]);
      const list = [...projects];
      list.splice(editingIndex, 1);
      setProjects(list);
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button onClick={handleGlobalSave}>
          <FaSave /> Save Changes to Live Site
        </Button>
      </div>

      <Grid>
        <NewProjectCard onClick={openNewModal}>
          <FaPlus size={24} style={{ marginBottom: "0.5rem" }} />
          <span>Add New Project</span>
        </NewProjectCard>

        {projects.map((project, index) => (
          <ProjectCard key={index} onClick={() => openEditModal(index)}>
            <Badge>{project.type}</Badge>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectMeta>
              <FaCalendar size={12} /> {project.date}
            </ProjectMeta>
            <ProjectMeta>
              <FaCode size={12} /> {project.tech_stack?.slice(0, 30)}
              {project.tech_stack?.length > 30 ? "..." : ""}
            </ProjectMeta>
            {project.repository && (
              <ProjectMeta>
                <FaGithub size={12} /> Repository linked
              </ProjectMeta>
            )}
          </ProjectCard>
        ))}
      </Grid>

      <Modal isOpen={showModal} handleClose={() => setShowModal(false)}>
        <ModalContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ margin: 0 }}>
              {editingIndex === -1 ? "New Project" : "Edit Project"}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormGroup>
              <label>Project Title</label>
              <input
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
                placeholder="My Awesome Project"
              />
            </FormGroup>

            <FormGroup>
              <label>Date / Timeframe</label>
              <input
                name="date"
                value={editFormData.date}
                onChange={handleInputChange}
                placeholder="Jan 2024 - Present"
              />
            </FormGroup>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormGroup>
              <label>Type</label>
              <select
                name="type"
                value={editFormData.type}
                onChange={handleInputChange}
              >
                <option value="personal">Personal</option>
                <option value="professional">Professional</option>
                <option value="academic">Academic</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label>Repository URL</label>
              <input
                name="repository"
                value={editFormData.repository}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
              />
            </FormGroup>
          </div>

          <FormGroup>
            <label>Tech Stack (comma separated)</label>
            <input
              name="tech_stack"
              value={editFormData.tech_stack}
              onChange={handleInputChange}
              placeholder="React, Firebase, Node.js"
            />
          </FormGroup>

          <FormGroup>
            <label>Description</label>
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Describe what the project is about..."
            />
          </FormGroup>

          <ButtonGroup>
            {editingIndex !== -1 && (
              <Button
                type="button"
                className="danger"
                onClick={deleteProject}
                style={{ marginRight: "auto" }}
              >
                <FaTrash /> Delete
              </Button>
            )}
            <Button type="button" onClick={saveModal}>
              <FaSave /> {editingIndex === -1 ? "Add to List" : "Update List"}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProjects;
