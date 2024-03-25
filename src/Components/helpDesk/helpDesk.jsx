import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './helpDesk.css';
import NavBar from '../Navbar';
import { useTranslation } from 'react-i18next';



const HelpDesk = () => {
  const [message, setMessage] = useState('');

   const userId=localStorage.getItem('UserId')
  const { t } = useTranslation();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://45.80.153.244/complaint/createComplaints', { user_id: userId, complaint: message });
      window.alert('Complaint submitted successfully!');
      setMessage('');
    } catch (error) {
      window.alert('Error submitting complaint:', error);
    }
  };




  return (
    <>
    <div>

      <NavBar />
      <div className='help-desk-page d-flex w-100 justify-content-center align-items-center'>
        <div className='col-md-6 col-12 text-center container'>
          <h2>{t('helpDesk')}</h2>
          <form onSubmit={handleSubmit} className='d-flex flex-column align-items-center'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('enterComplaint')}
              required
              ></textarea>
            <button className='mt-3' type='submit'>
              {t('submit')}
            </button>
          </form>
        </div>
      </div>
              </div>
    </>
  );
};

export default HelpDesk;