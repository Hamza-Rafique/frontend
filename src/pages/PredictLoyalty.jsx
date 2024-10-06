import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/PredictLoyalty.css";
import Input from "../components/Input";

const PredictLoyalty = () => {
  const [formData, setFormData] = useState({
    Frequency_of_Communication: "",
    Help_in_Crises: "",
    Financial_Support_Provided: "",
    Attendance_at_Events: "",
    Sentiment_Score: "",
    Relationship_Name: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInput = (data) => {
    let errors = {};
    if (
      !data.Frequency_of_Communication ||
      isNaN(data.Frequency_of_Communication) ||
      data.Frequency_of_Communication <= 0
    ) {
      errors.Frequency_of_Communication =
        "Frequency of Communication must be a positive number.";
    }
    if (
      !data.Help_in_Crises ||
      isNaN(data.Help_in_Crises) ||
      data.Help_in_Crises <= 0
    ) {
      errors.Help_in_Crises = "Help in Crises must be a positive number.";
    }
    if (
      !data.Financial_Support_Provided ||
      isNaN(data.Financial_Support_Provided) ||
      data.Financial_Support_Provided <= 0
    ) {
      errors.Financial_Support_Provided =
        "Financial Support Provided must be a positive number.";
    }
    if (
      !data.Attendance_at_Events ||
      isNaN(data.Attendance_at_Events) ||
      data.Attendance_at_Events < 0 ||
      data.Attendance_at_Events > 100
    ) {
      errors.Attendance_at_Events =
        "Attendance at Events must be a percentage (0-100).";
    }
    if (
      !data.Sentiment_Score ||
      isNaN(data.Sentiment_Score) ||
      data.Sentiment_Score < 1 ||
      data.Sentiment_Score > 10
    ) {
      errors.Sentiment_Score = "Sentiment Score must be between 1 and 10.";
    }
    if (!data.Relationship_Name || data.Relationship_Name.trim() === "") {
      errors.Relationship_Name = "Relationship Name cannot be empty.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData
      );
      const loyaltyScore = response.data.loyalty_score;
      showToastMessage(loyaltyScore, formData.Relationship_Name);

      setFormData({
        Frequency_of_Communication: "",
        Help_in_Crises: "",
        Financial_Support_Provided: "",
        Attendance_at_Events: "",
        Sentiment_Score: "",
        Relationship_Name: "",
      });
      setErrors({});

      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds delay
    } catch (error) {
      console.error(error);
      toast.error("Error predicting loyalty score. Please try again.");
    }
  };

  const showToastMessage = (loyaltyScore, relationshipName) => {
    let message = "";
    let type = "info";

    if (loyaltyScore >= 8) {
      message = `🎉 Congratulations ${relationshipName}! You have a high loyalty score!`;
      type = "success";
    } else if (loyaltyScore >= 5) {
      message = `🙂 ${relationshipName}, your loyalty score is average. Keep nurturing those relationships!`;
      type = "warning";
    } else {
      message = `😟 Sorry ${relationshipName}, your loyalty score is low. Consider improving your connections.`;
      type = "error";
    }

    toast[type](message);
  };

  return (
    <div className="predict-loyalty">
      <div className="header">
        <h1>Predict</h1>
        <img
          src="https://media4.giphy.com/media/gEXrnOekt7MFVHPah4/giphy.gif?cid=6c09b952mrmy7g3podazn6i5f5c8i2iul4ajc1m6dfury3w9&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=ts"
          alt="logo"
          className="logo"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          label="Please enter the Communication Frequency between X and Y."
          name="Frequency_of_Communication"
          value={formData.Frequency_of_Communication}
          placeholder="Communication Frequency"
          onChange={handleChange}
          error={errors.Frequency_of_Communication}
        />
        <span className="note">
          "The frequency should be between X (minimum) and Y (maximum). For
          example, if communication happens once a week, enter the appropriate
          number."
        </span>
        <Input
          label="Please enter the amount of Help provided in Crises between X and Y"
          name="Help_in_Crises"
          value={formData.Help_in_Crises}
          placeholder="Help in Crises"
          onChange={handleChange}
          error={errors.Help_in_Crises}
        />
        <span className="note">
          "Help in crises is measured in a range between X and Y. Enter the
          number of times help was provided."
        </span>
        <Input
          label="Please enter the Financial Support Provided between X and Y"
          name="Financial_Support_Provided"
          value={formData.Financial_Support_Provided}
          placeholder="Financial Support Provided"
          onChange={handleChange}
          error={errors.Financial_Support_Provided}
        />
        <span className="note">
          "Financial Support Provided is measured in a range between X and Y.
          Enter the amount of financial support provided."
        </span>
        <Input
          label="Please enter the Attendance at Events as a percentage (0-100)."
          name="Attendance_at_Events"
          value={formData.Attendance_at_Events}
          placeholder="Attendance at Events (%)"
          onChange={handleChange}
          error={errors.Attendance_at_Events}
        />
        <span className="note">
          "The attendance percentage should be between 0% and 100%. For example,
          if attended half of the events, enter 50."
        </span>
        <Input
          label="Please enter the Sentiment Score between 1 and 10."
          name="Sentiment_Score"
          value={formData.Sentiment_Score}
          placeholder="Sentiment Score (1-10)"
          onChange={handleChange}
          error={errors.Sentiment_Score}
        />
        <span className="note">
          "The sentiment score should be between 1 (negative) and 10 (positive).
          For instance, if the sentiment is neutral, you may enter 5"
        </span>
        <Input
          label="Please enter the Relationship Name"
          name="Relationship_Name"
          value={formData.Relationship_Name}
          placeholder="Relationship Name"
          onChange={handleChange}
          error={errors.Relationship_Name}
          type="text"
        />
        <span className="note">
          {" "}
          "The relationship name cannot be empty. Enter a valid name for
          identification."{" "}
        </span>
        <button type="submit">Predict Loyalty</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PredictLoyalty;
