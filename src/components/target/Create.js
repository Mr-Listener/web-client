import { actionCompletedToast } from 'components/ui/toast';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import TargetKinds from '../../models/TargetKinds';
import secureApiFetch from '../../services/api';
import Breadcrumb from '../ui/Breadcrumb';
import PrimaryButton from '../ui/buttons/Primary';
import Title from '../ui/Title';

export default function TargetCreateForm({ match, history }) {
    const projectId = match.params.id;
    const [newTarget, setNewTarget] = useState({ projectId: projectId, name: null, kind: TargetKinds[0].value })
    const [loading, setLoading] = useState(false)

    const [project] = useFetch(`/projects/${projectId}`)

    const handleCreate = async (ev) => {
        ev.preventDefault();

        setLoading(true)
        secureApiFetch(`/targets`, { method: 'POST', body: JSON.stringify(newTarget) })
            .then(() => {
                history.push(`/projects/${projectId}`);
                actionCompletedToast(`The target "${newTarget.name}" has been added.`);
            })
    }
    const handleFormChange = ev => {
        const target = ev.target;
        const name = target.name;
        const value = target.value;
        setNewTarget({ ...newTarget, [name]: value });
    };

    return (
        <div>
            <div className='heading'>
                <Breadcrumb>
                    <Link to="/projects">Projects</Link>
                    {project && <Link to={`/projects/${project.id}`}>{project.name}</Link>}
                </Breadcrumb>
            </div>
            <form onSubmit={handleCreate}>
                <Title title='Create Target' />
                <label>Name
                    <input type="text" name="name" onChange={handleFormChange} required autoFocus /></label>
                <label>Kind
                    <select name="kind" onChange={handleFormChange}>
                        {TargetKinds.map((targetKind, index) =>
                            <option key={index} value={targetKind.value}>{targetKind.description}</option>
                        )}
                    </select>
                </label>
                <PrimaryButton type="submit"
                    disabled={loading}>Create</PrimaryButton>
            </form>
        </div>
    )
}
