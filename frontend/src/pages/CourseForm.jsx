import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

import NotificationContext from '../context/NotificationContext';

const CourseForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        duration: ''
    });
    const [categories, setCategories] = useState([]);
    const { id } = useParams(); // Get ID if editing
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchCourseData();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('lms/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchCourseData = async () => {
        try {
            const response = await api.get(`lms/courses/${id}/`);
            const { title, description, category, duration } = response.data;
            setFormData({ title, description, category: category || '', duration: duration || '' });
        } catch (error) {
            console.error("Failed to fetch course data", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`lms/courses/${id}/`, formData);
                showNotification('Course updated successfully!', 'success');
            } else {
                await api.post('lms/courses/', formData);
                showNotification('Course created successfully!', 'success');
            }
            navigate('/courses');
        } catch (error) {
            console.error("Failed to save course", error);
            showNotification('Failed to save course.', 'error');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-12">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-2xl animate-fade-in-up backdrop-blur-md">
                <h2 className="text-3xl font-extrabold text-primary-dark mb-6 text-center">{id ? 'Edit Course' : 'Create New Course'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Introduction to React"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all glass-input text-primary-dark placeholder-primary/40 font-medium"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            placeholder="e.g. 10 Hours, 4 Weeks"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all glass-input text-primary-dark placeholder-primary/40 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all glass-input text-primary-dark font-medium"
                            required
                        >
                            <option value="" className="bg-white text-primary">Select a Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-white text-primary">{cat.name}</option>
                            ))}
                        </select>
                         <p className="text-xs text-primary/60 mt-1">* Ensure categories exist in backend or create one via API provided.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Course details..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all glass-input text-primary-dark placeholder-primary/40 font-medium"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={() => navigate('/courses')}
                            className="px-6 py-3 rounded-xl border border-primary/30 text-primary font-bold hover:bg-white/20 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-accent-warm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md"
                        >
                            {id ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;
