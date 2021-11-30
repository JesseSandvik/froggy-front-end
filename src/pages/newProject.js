import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { createProject } from '../utils/api';
import ErrorAlert from '../layout/errorAlert';
import ProjectForm from '../views/projects/projectForm';

const NewProject = () => {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const initialProjectState = {
        title: "",
        description: "",
        due_date: "",
        due_time: "",
    }

    const [project, setProject] = useState({...initialProjectState});
    const [error, setError] = useState(null);

    const createProjectChangeHandler = ({ target }) => {
        setProject({
            ...project,
            [target.name]: target.value,
        });
    }

    const createProjectSubmitHandler = (event) => {
        event.preventDefault();
        createProject({
            ...project,
            creator_name: user.name,
            creator_email: user.email,
            completed: false,
        })
            .then((createdProject) => navigate(`/projects/${createdProject.project_id}`))
            .catch((error) => setError(error));
        setProject({...initialProjectState})
    }
    
    return (
        <section className="projects">
            <div className="projects-title">
                <div className="item item-one">
                    <Link to="/projects">
                        <i className="fas fa-window-close"></i>
                        <small>Cancel</small>
                    </Link>
                </div>
                <div className="item item-two">
                    <h2>Create A New Project</h2>
                </div>
            </div>
            <div className="projects-form">
                <ErrorAlert error={error} />
                <ProjectForm
                    changeHandler={createProjectChangeHandler}
                    submitHandler={createProjectSubmitHandler}
                />
            </div>
        </section>
    );
}

export default withAuthenticationRequired(NewProject);