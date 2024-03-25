import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './helpDesk.css';
import NavBar from '../Navbar';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      complaintId: 'Complaint ID',
      userId: 'User ID',
      complaint: 'Complaint',
      userName: 'User Name',
      email: 'Email',
      complaints: 'Complaints',
    },
  },
  tr: {
    translation: {
      complaintId: 'Şikayet ID',
      userId: 'Kullanıcı ID',
      complaint: 'Şikayet',
      userName: 'Kullanıcı Adı',
      email: 'E-posta',
      complaints: 'Şikayetler',
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  interpolation: {
    escapeValue: false, // React already escapes the values
  },
});

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const { t, i18n } = useTranslation(); // Translation function

  useEffect(() => {
    // Retrieve userId from local storage
    const storedUserId = localStorage.getItem('UserId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    // Fetch complaints from the server
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://45.80.153.244/complaint/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://45.80.153.244/Users/getUserById', {
          params: { id: userId },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUsers();
  }, [userId]);


  return (
    <>
      <NavBar />
      <div className='help-desk-page d-flex w-100 justify-content-center align-items-center'>
        <div className='col-md-6 col-12 text-center container'>
          <div className='complaints-table'>
            <h2>{t('complaints')}</h2>
            <table className='w-100'>
              <thead>
                <tr>
                  <th>{t('complaintId')}</th>
                  <th>{t('userId')}</th>
                  <th>{t('complaint')}</th>
                  <th>{t('userName')}</th>
                  <th>{t('email')}</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.complaint_id}</td>
                    <td>{complaint.user_id}</td>
                    <td>{complaint.complaint}</td>
                    <td>{users.firstName}</td>
                    <td>{users.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaint;
