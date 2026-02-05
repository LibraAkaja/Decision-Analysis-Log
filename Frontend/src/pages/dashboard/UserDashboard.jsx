import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    fetchDecisions,
    createDecision,
    deleteDecision,
    getDecisionById,
    addOption,
    updateOption,
    deleteOption,
} from '../../api/client';
import '../style/Dashboard.css';

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [decisions, setDecisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Create decision form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });

    // Selected decision details
    const [selectedDecision, setSelectedDecision] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Add option form
    const [showAddOption, setShowAddOption] = useState(false);
    const [optionForm, setOptionForm] = useState({ option_text: '', rating: null });

    // Edit option form
    const [editingOptionId, setEditingOptionId] = useState(null);
    const [editOptionForm, setEditOptionForm] = useState({ option_text: '', rating: null });

    useEffect(() => {
        loadDecisions();
    }, []);

    const loadDecisions = async () => {
        try {
            setLoading(true);
            const response = await fetchDecisions();
            setDecisions(response.data || []);
            setError('');
        } catch (err) {
            setError('Failed to load decisions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDecision = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            await createDecision(formData);
            setFormData({ title: '', description: '' });
            setShowCreateForm(false);
            loadDecisions();
            setError('');
        } catch (err) {
            setError('Failed to create decision');
            console.error(err);
        }
    };

    const handleDeleteDecision = async (id) => {
        if (!window.confirm('Are you sure you want to delete this decision?')) return;

        try {
            await deleteDecision(id);
            loadDecisions();
            if (selectedDecision?.id === id) {
                setSelectedDecision(null);
                setSelectedOptions([]);
            }
            setError('');
        } catch (err) {
            setError('Failed to delete decision');
        }
    };

    const handleSelectDecision = async (id) => {
        try {
            const response = await getDecisionById(id);
            setSelectedDecision(response.data);
            setSelectedOptions(response.data.options || []);
            setShowAddOption(false);
            setEditingOptionId(null);
        } catch (err) {
            setError('Failed to load decision details');
        }
    };

    const handleAddOption = async (e) => {
        e.preventDefault();
        if (!optionForm.option_text.trim()) {
            setError('Option text is required');
            return;
        }

        try {
            await addOption({
                decision_id: selectedDecision.id,
                option_text: optionForm.option_text,
                rating: optionForm.rating,
            });
            setOptionForm({ option_text: '', rating: null });
            setShowAddOption(false);
            handleSelectDecision(selectedDecision.id);
            setError('');
        } catch (err) {
            setError('Failed to add option');
            console.error(err);
        }
    };

    const handleUpdateOption = async (e) => {
        e.preventDefault();
        if (!editOptionForm.option_text.trim()) {
            setError('Option text is required');
            return;
        }

        try {
            await updateOption(editingOptionId, {
                option_text: editOptionForm.option_text,
                rating: editOptionForm.rating,
            });
            setEditingOptionId(null);
            setEditOptionForm({ option_text: '', rating: null });
            handleSelectDecision(selectedDecision.id);
            setError('');
        } catch (err) {
            setError('Failed to update option');
            console.error(err);
        }
    };

    const handleDeleteOption = async (id) => {
        if (!window.confirm('Delete this option?')) return;

        try {
            await deleteOption(id);
            handleSelectDecision(selectedDecision.id);
            setError('');
        } catch (err) {
            setError('Failed to delete option');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const startEditOption = (option) => {
        setEditingOptionId(option.id);
        setEditOptionForm({
            option_text: option.option_text,
            rating: option.rating,
        });
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1>Decision Analyzer</h1>
                    <p>Welcome, {user?.email}</p>
                </div>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </header>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-content">
                {/* Decisions List */}
                <div className="decisions-panel">
                    <div className="panel-header">
                        <h2>Your Decisions</h2>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="btn-secondary"
                        >
                            {showCreateForm ? 'Cancel' : '+ New Decision'}
                        </button>
                    </div>

                    {showCreateForm && (
                        <form onSubmit={handleCreateDecision} className="create-form">
                            <input
                                type="text"
                                placeholder="Decision title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                            />
                            <button type="submit" className="btn-primary">Create Decision</button>
                        </form>
                    )}

                    {loading ? (
                        <p className="loading">Loading decisions...</p>
                    ) : decisions.length === 0 ? (
                        <p className="empty-state">No decisions yet. Create one to get started!</p>
                    ) : (
                        <div className="decisions-list">
                            {decisions.map((decision) => (
                                <div
                                    key={decision.id}
                                    className={`decision-item ${selectedDecision?.id === decision.id ? 'active' : ''}`}
                                    onClick={() => handleSelectDecision(decision.id)}
                                >
                                    <div className="decision-info">
                                        <h3>{decision.title}</h3>
                                        <p className="decision-meta">
                                            {decision.options?.length || 0} options
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteDecision(decision.id);
                                        }}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Decision Details */}
                <div className="details-panel">
                    {selectedDecision ? (
                        <>
                            <div className="details-header">
                                <h2>{selectedDecision.title}</h2>
                            </div>

                            {selectedDecision.description && (
                                <p className="decision-description">{selectedDecision.description}</p>
                            )}

                            <div className="options-section">
                                <div className="options-header">
                                    <h3>Options</h3>
                                    <button
                                        onClick={() => setShowAddOption(!showAddOption)}
                                        className="btn-secondary"
                                    >
                                        {showAddOption ? 'Cancel' : '+ Add Option'}
                                    </button>
                                </div>

                                {showAddOption && (
                                    <form onSubmit={handleAddOption} className="add-option-form">
                                        <input
                                            type="text"
                                            placeholder="Option text"
                                            value={optionForm.option_text}
                                            onChange={(e) =>
                                                setOptionForm({ ...optionForm, option_text: e.target.value })
                                            }
                                            required
                                        />
                                        <div className="form-row">
                                            <input
                                                type="number"
                                                placeholder="Rating (1-5)"
                                                min="1"
                                                max="5"
                                                value={optionForm.rating || ''}
                                                onChange={(e) =>
                                                    setOptionForm({
                                                        ...optionForm,
                                                        rating: e.target.value ? parseInt(e.target.value) : null,
                                                    })
                                                }
                                            />
                                            <button type="submit" className="btn-primary">Add</button>
                                        </div>
                                    </form>
                                )}

                                {selectedOptions.length === 0 ? (
                                    <p className="empty-state">No options yet.</p>
                                ) : (
                                    <div className="options-list">
                                        {selectedOptions.map((option) => (
                                            <div key={option.id} className="option-item">
                                                {editingOptionId === option.id ? (
                                                    <form onSubmit={handleUpdateOption} className="edit-form">
                                                        <input
                                                            type="text"
                                                            value={editOptionForm.option_text}
                                                            onChange={(e) =>
                                                                setEditOptionForm({
                                                                    ...editOptionForm,
                                                                    option_text: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Rating (1-5)"
                                                            min="1"
                                                            max="5"
                                                            value={editOptionForm.rating || ''}
                                                            onChange={(e) =>
                                                                setEditOptionForm({
                                                                    ...editOptionForm,
                                                                    rating: e.target.value
                                                                        ? parseInt(e.target.value)
                                                                        : null,
                                                                })
                                                            }
                                                        />
                                                        <div className="form-actions">
                                                            <button type="submit" className="btn-primary">Save</button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingOptionId(null)}
                                                                className="btn-secondary"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className="option-content">
                                                            <p>{option.option_text}</p>
                                                            {option.rating && (
                                                                <span className="rating-badge">
                                                                    ★ {option.rating}/5
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="option-actions">
                                                            <button
                                                                onClick={() => startEditOption(option)}
                                                                className="btn-edit"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteOption(option.id)}
                                                                className="btn-delete"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state-large">
                            <p>Select a decision to view and manage its options</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}