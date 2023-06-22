import React, { useEffect, useRef, useState } from 'react';
import { config, host } from '../utils/config';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatBox from '../components/chatBox/chatBox';

function Chat() {
  const socket = useRef();
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

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  const getAllusers = async () => {
    const { data } = await axios.get(
      `${config.getAllContacts}/${userData?._id}`
    );
    return data;
  };

  useEffect(() => {
    if (currentUser) {
      getAllusers().then((result) => {
        setContacts(result);
      });
    }
  }, [currentUser]);

  return (
    <ChatBox
      contacts={contacts}
      currentUser={currentUser}
      socket={socket}
      userData={userData}
    />
  );
}

export default Chat;
