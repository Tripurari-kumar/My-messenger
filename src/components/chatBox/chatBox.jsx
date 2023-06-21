import React, { useEffect, useRef, useState } from 'react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import './chatBox.css';
import Picker from 'emoji-picker-react';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { config } from '../../utils/config';
import moment from 'moment';
import { sortedContactsAccToTime } from '../../utils/sortingUtility/sortingUtlity';
import Logo from '../../assets/logo.jpeg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CustomButton from '../common/button/button';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/modal/modal';

function ChatBox({ contacts, currentUser, socket, userData }) {
  const scrollRef = useRef();
  const navigate = useNavigate();
  const [activeContact, setActiveContact] = useState();
  const [msg, setMsg] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [allLastMsgs, setAllLastMsgs] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [openmodal, setOpenModal] = useState(false);
  // const msgNode = document.getElementById('add-message');

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {
    let message = msg;

    message += event.emoji;
    setMsg(message);
  };

  const getAllLastMsgs = async () => {
    const { data } = await axios.get(
      `${config.getAllLastMessagesRoutes}/${userData?._id}`
    );
    return data;
  };

  useEffect(() => {
    getAllLastMsgs().then((result) => {
      setAllLastMsgs(result);
    });
  }, [allMessages]);

  const handleSendMsg = async (msg) => {
    await axios.post(config.sendMessageRoutes, {
      from: currentUser?._id,
      to: activeContact?._id,
      message: msg,
      sentTime: new Date().toString(),
    });
    socket.current.emit('send-msg', {
      from: currentUser?._id,
      to: activeContact?._id,
      message: msg,
      sentTime: new Date().toString(),
    });

    const msgs = [...allMessages];
    msgs.push({ fromSelf: true, message: msg });
    setAllMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (msg) => {
        console.log(msg);
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  });

  useEffect(() => {
    arrivalMessage && setAllMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
  }, [allMessages]);

  const sendChat = (event) => {
    event.preventDefault();

    setShowEmojiPicker(false);
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  // useEffect(() => {
  //   if (msgNode) {
  //     msgNode.addEventListener('keyup', function (event) {
  //       event.preventDefault();
  //       console.log(event);
  //       if (event.key === 'Enter') {
  //         console.log('hi');
  //         setShowEmojiPicker(false);
  //         if (msg.length > 0) {
  //           handleSendMsg(msg);
  //           setMsg('');
  //         }
  //       }
  //     });
  //   }
  // }, [msgNode]);

  const onContactClick = (contact) => {
    setActiveContact(contact);
  };
  useEffect(() => {
    if (!isEmpty(contacts)) {
      setActiveContact(contacts?.[0]);
    }
  }, [contacts]);

  const getMsgs = async () => {
    const { data } = await axios.post(config.getAllMessagesRoutes, {
      from: currentUser?._id,
      to: activeContact?._id,
    });
    return data;
  };

  useEffect(() => {
    if (activeContact) {
      getMsgs().then((result) => {
        setAllMessages(result);
      });
    }
  }, [activeContact]);

  const getTimeStamp = (allMessages, message, index) => {
    if (index === allMessages?.length - 1) {
      if (message?.fromSelf) {
        return (
          <p className='response-time time'>
            {' '}
            {moment(message?.sentTime).fromNow()}
          </p>
        );
      } else {
        return <p className='time'> {moment(message?.sentTime).fromNow()}</p>;
      }
    } else if (index > 0) {
      if (allMessages?.[index + 1]?.fromSelf !== message?.fromSelf) {
        if (message?.fromSelf) {
          return (
            <p className='response-time time'>
              {' '}
              {moment(message?.sentTime).fromNow()}
            </p>
          );
        } else {
          return <p className='time'> {moment(message?.sentTime).fromNow()}</p>;
        }
      }
    }
  };

  const getlastMsgByUserid = (id) => {
    return allLastMsgs?.find((item) => item?.id === id)?.message;
  };

  const getLastMsgTimeLap = (id) => {
    return allLastMsgs?.find((item) => item?.id === id)?.sentTime
      ? moment(allLastMsgs?.find((item) => item?.id === id)?.sentTime).fromNow()
      : '';
  };

  useEffect(() => {
    sortedContactsAccToTime(
      allLastMsgs,
      currentUser,
      contacts,
      setSortedContacts
    );
  }, [allLastMsgs]);

  const handleLogout = () => {
    localStorage.removeItem('messenger-app-user');
    navigate('/login');
  };

  return (
    <div className='wrapper'>
      <Modal
        open={openmodal}
        desc={'Are you sure you want to Logout ?'}
        btnText2='Logout'
        btnText1='Cancel'
        handleClose={() => {
          setOpenModal(false);
        }}
        handleContinue={() => handleLogout()}
      />
      <div
        className='profile-icon'
        style={{
          backgroundImage: `url(${currentUser?.avatarImage})`,
        }}
      ></div>
      <div className='welcome-text'>{`Hi, ${currentUser?.userName} !`}</div>
      <div className='logout'>
        <CustomButton
          variant='contained'
          sx={{ cursor: 'pointer' }}
          text={'Logout'}
          endIcon={<ExitToAppIcon />}
          onClick={() => setOpenModal(true)}
        />
      </div>
      <div className='container'>
        <div className='discussions'>
          <div className='logoHeader'>
            <img
              src={Logo}
              style={{ height: '80px', width: '80px' }}
              alt={'logo'}
            />
            <span>FREE CHAT (Contacts)</span>
          </div>
          {sortedContacts?.map((contact, key) => {
            return (
              <div
                className={
                  activeContact?._id === contact?._id
                    ? 'discussion message-active'
                    : 'discussion'
                }
                onClick={() => onContactClick(contact)}
              >
                <div
                  className='photo'
                  style={{
                    backgroundImage: `url(${contact?.avatarImage})`,
                  }}
                >
                  <div className='online'></div>
                </div>
                <div className='desc-contact'>
                  <p className='name'>{contact?.userName}</p>
                  <p className='message'>{getlastMsgByUserid(contact?._id)} </p>
                </div>
                {getLastMsgTimeLap(contact?._id) && (
                  <div className='timer'>{getLastMsgTimeLap(contact?._id)}</div>
                )}
              </div>
            );
          })}
        </div>
        <div className='chat'>
          <div className='header-chat'>
            <div
              className='current-avatar'
              style={{
                backgroundImage: `url(${activeContact?.avatarImage})`,
              }}
            >
              <div className='online'></div>
            </div>
            <p className='name'>{activeContact?.userName}</p>
            <i
              className='icon clickable fa fa-ellipsis-h right'
              aria-hidden='true'
            ></i>
          </div>
          <div className='messages-chat'>
            {allMessages?.map((message, index) => {
              if (message?.fromSelf) {
                return (
                  <div ref={scrollRef}>
                    <div className='message text-only'>
                      <div className='response'>
                        <p className='text'> {message?.message}</p>
                      </div>
                    </div>
                    {getTimeStamp(allMessages, message, index)}
                  </div>
                );
              } else if (
                allMessages?.[index - 1]?.fromSelf === false &&
                message?.fromSelf === false
              ) {
                return (
                  <div ref={scrollRef}>
                    <div className='message text-only'>
                      <p className='text'> {message?.message}</p>
                    </div>
                    {getTimeStamp(allMessages, message, index)}
                  </div>
                );
              } else {
                return (
                  <div ref={scrollRef}>
                    <div className='message'>
                      <div
                        className='photo'
                        style={{
                          backgroundImage: ` url(${activeContact?.avatarImage})`,
                        }}
                      >
                        <div className='online'></div>
                      </div>
                      <p className='text'> {message?.message} </p>
                    </div>
                    {getTimeStamp(allMessages, message, index)}
                  </div>
                );
              }
            })}
          </div>
          <div className='footer-chat'>
            <i className='icon' aria-hidden='true'>
              <EmojiEmotionsIcon
                onClick={handleEmojiPickerhideShow}
                sx={{ cursor: 'pointer' }}
              />
            </i>
            <div className='emoji'>
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
            </div>

            <input
              type='text'
              id='add-message'
              className='write-message'
              placeholder='Type your message here'
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
            ></input>
            <i className='icon' aria-hidden='true'>
              <SendIcon
                onClick={(e) => sendChat(e)}
                sx={{ cursor: 'pointer' }}
              />
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
