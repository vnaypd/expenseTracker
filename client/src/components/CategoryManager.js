import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManager = () => {
     const [categories, setCategories] = useState([]);
     const [newCategory, setNewCategory] = useState('');
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

     useEffect(() => {
          fetchCategories();
     }, []);

     const fetchCategories = async () => {
          try {
               setLoading(true);
               const token = localStorage.getItem('token');
               const res = await axios.get('/categories', {
                    headers: { 'x-auth-token': token }
               });
               setCategories(res.data.categories || []);
          } catch (err) {
               setError(err.response?.data?.message || 'Failed to fetch categories');
          } finally {
               setLoading(false);
          }
     };

     const addCategory = async () => {
          if (!newCategory.trim()) return;

          try {
               setLoading(true);
               const token = localStorage.getItem('token');
               const res = await axios.post('/categories', {
                    name: newCategory
               }, {
                    headers: { 'x-auth-token': token }
               });

               setCategories([...categories, res.data.category]);
               setNewCategory('');
          } catch (err) {
               setError(err.response?.data?.message || 'Failed to add category');
          } finally {
               setLoading(false);
          }
     };

     const deleteCategory = async (id) => {
          try {
               setLoading(true);
               const token = localStorage.getItem('token');
               await axios.delete(`/categories/${id}`, {
                    headers: { 'x-auth-token': token }
               });
               setCategories(categories.filter(cat => cat._id !== id));
          } catch (err) {
               setError(err.response?.data?.message || 'Failed to delete category');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="category-manager">
               <h2>Manage Categories</h2>
               {error && <div className="alert alert-danger">{error}</div>}

               <div className="add-category">
                    <input
                         type="text"
                         value={newCategory}
                         onChange={(e) => setNewCategory(e.target.value)}
                         placeholder="Enter category name"
                         disabled={loading}
                    />
                    <button
                         onClick={addCategory}
                         disabled={loading || !newCategory.trim()}
                         className="btn btn-primary"
                    >
                         {loading ? 'Adding...' : 'Add Category'}
                    </button>
               </div>

               <div className="category-list">
                    <h3>Your Categories</h3>
                    {categories.length === 0 ? (
                         <p>No categories found. Add your first category!</p>
                    ) : (
                         <ul>
                              {categories.map(category => (
                                   <li key={category._id}>
                                        <span>{category.name}</span>
                                        <button
                                             onClick={() => deleteCategory(category._id)}
                                             disabled={loading}
                                             className="btn btn-sm btn-danger"
                                        >
                                             Delete
                                        </button>
                                   </li>
                              ))}
                         </ul>
                    )}
               </div>
          </div>
     );
};

export default CategoryManager;