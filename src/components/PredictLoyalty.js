import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PredictLoyalty.css'; // Make sure this file exists

const PredictLoyalty = () => {
  const [formData, setFormData] = useState({
    Frequency_of_Communication: '',
    Help_in_Crises: '',
    Financial_Support_Provided: '',
    Attendance_at_Events: '',
    Sentiment_Score: '',
    Relationship_Name: '' // Add relationship name to form data
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      const loyaltyScore = response.data.loyalty_score;
      showToastMessage(loyaltyScore, formData.Relationship_Name); // Pass the relationship name
      // Clear form fields after submission
      setFormData({
        Frequency_of_Communication: '',
        Help_in_Crises: '',
        Financial_Support_Provided: '',
        Attendance_at_Events: '',
        Sentiment_Score: '',
        Relationship_Name: '' // Reset relationship name
      });
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds delay
    } catch (error) {
      console.error(error);
      toast.error("Error predicting loyalty score. Please try again."); // Error toast
    }
  };

  const showToastMessage = (loyaltyScore, relationshipName) => {
    let message = '';
    let type = 'info'; // Default to info type

    if (loyaltyScore >= 8) {
      message = `🎉 Congratulations ${relationshipName}! You have a high loyalty score!`;
      type = 'success'; // Success type
    } else if (loyaltyScore >= 5) {
      message = `🙂 ${relationshipName}, your loyalty score is average. Keep nurturing those relationships!`;
      type = 'warning'; // Warning type
    } else {
      message = `😟 Sorry ${relationshipName}, your loyalty score is low. Consider improving your connections.`;
      type = 'error'; // Error type
    }

    toast[type](message);
  };

  return (
    <div className="predict-loyalty">
      <h1>Predict Loyalty</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="Frequency_of_Communication"
          placeholder="Communication Frequency"
          onChange={handleChange}
        />
        <input
          name="Help_in_Crises"
          placeholder="Help in Crises"
          onChange={handleChange}
        />
        <input
          name="Financial_Support_Provided"
          placeholder="Financial Support Provided"
          onChange={handleChange}
        />
        <input
          name="Attendance_at_Events"
          placeholder="Attendance at Events (%)"
          onChange={handleChange}
        />
        <input
          name="Sentiment_Score"
          placeholder="Sentiment Score (1-10)"
          onChange={handleChange}
        />
        <input
          name="Relationship_Name" // New input field for relationship name
          placeholder="Relationship Name"
          onChange={handleChange}
        />
        <button type="submit">Predict Loyalty</button>
      </form>
      
      <ToastContainer /> {/* Toast container for displaying toasts */}
    </div>
  );
};

export default PredictLoyalty;
