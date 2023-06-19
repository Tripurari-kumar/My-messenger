import React, { useEffect, useState } from 'react';
import { config } from '../utils/config';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Contacts from '../components/contacts/Contacts';

function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState();
  const [currentUser, setCurrentUser] = useState();
  const loggedInInformation = localStorage.getItem('messenger-app-user');
  const userData = JSON.parse(loggedInInformation);

  useEffect(() => {
    if (isEmpty(localStorage.getItem('messenger-app-user'))) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('messenger-app-user')));
    }
  }, []);

  const getAllusers = async () => {
    const { data } = await axios.get(
      `${config.getAllContacts}/${userData?._id}`
    );
    return data;
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.isAvatarImageSet) {
        getAllusers().then((result) => {
          setContacts(result);
        });
      } else {
        navigate('/profile');
      }
    }
  }, [currentUser]);

  return <Contacts contacts={contacts} currentUser={currentUser} />;
}

export default Chat;
