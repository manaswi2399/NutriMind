import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DietForm.css';

interface DietFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const DietForm: React.FC<DietFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    dietType: 'balanced',
    calories: 2000,
    protein: 'moderate',
    restrictions: '',
    meals: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="diet-form-section">
      <div className="form-container glass">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="form-title">
            <span className="title-icon">🎯</span>
            Create Your Meal Plan
          </h2>
          <p className="form-subtitle">
            Tell us about your dietary goals and preferences
          </p>

          <form onSubmit={handleSubmit} className="diet-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Diet Type</label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="balanced">Balanced</option>
                  <option value="low-carb">Low Carb</option>
                  <option value="high-protein">High Protein</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Daily Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  className="form-input"
                  min="1000"
                  max="4000"
                  step="100"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Protein Level</label>
                <select
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Meals Per Day</label>
                <input
                  type="number"
                  name="meals"
                  value={formData.meals}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  max="6"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Restrictions & Allergies</label>
              <textarea
                name="restrictions"
                value={formData.restrictions}
                onChange={handleChange}
                className="form-textarea"
                placeholder="E.g., no nuts, dairy-free, gluten-free..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Generating...
                </>
              ) : (
                <>
                  <span>Generate Meal Plan</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default DietForm;
