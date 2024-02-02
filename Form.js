// src/components/VoiceForm.js
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import './App.css';
import Logo from './Logo';

const Form = () => {
  const { transcript, listening, resetTranscript,browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [formData, setFormData, activeField] = useState({
    FirstName: '',
    LastName: '',
    State: '',
    District: '',
    Village: '',
    PanNumber: '',
    AadhaarNumber: '',
  });
  

  const inputRefs = useRef({
    FirstName: React.createRef(),
    LastName: React.createRef(),
    State: React.createRef(),
    District: React.createRef(),
    Village: React.createRef(),
    PanNumber: React.createRef(),
    AadhaarNumber: React.createRef(),
  });

  const startListening = (field) => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    inputRefs.current[field].current.focus();
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setFormData({ ...formData, [activeField]: transcript });
    SpeechRecognition.abortListening();
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('YOUR_API_ENDPOINT', formData);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  useEffect(() => {
    if (Object.values(formData).every(Boolean)) {
      handleSubmit();
    }
  }, [formData]);
  if (!browserSupportsSpeechRecognition) {
    return null
}
  return (
    <div className="voice-form-container">
      <Logo />
      Address Details
      <form>
        {Object.keys(formData).map((field) => (
          <div key={field} className="form-group">
            <label>{field}</label>
            <input
              type="text"
              value={formData[field]}
              onChange={handleInputChange(field)}
              ref={inputRefs.current[field]}
            />
            <button onClick={() => startListening(field)}>Start</button>
            <button onClick={stopListening}>Stop</button>
           
          </div>
        ))}
      </form>
      <div className="listening-indicator">{listening && <div>Listening...</div>}</div>
      <div className="transcribed-text">{transcript && <div>Transcript: {transcript}</div>}</div>
      <div className="button-group">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Form;
