import React, { useEffect, useState } from 'react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import './Contacts.css';
import Picker from 'emoji-picker-react';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { config } from '../../utils/config';

function Contacts({ contacts, currentUser }) {
  console.log(contacts, currentUser);

  const [activeContact, setActiveContact] = useState();
  const [msg, setMsg] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {
    let message = msg;

    message += event.emoji;
    setMsg(message);
  };

  const handleSendMsg = async (msg) => {
    await axios.post(config.sendMessageRoutes, {
      from: currentUser?._id,
      to: activeContact?._id,
      message: msg,
      sentTime: new Date().toString(),
    });
  };

  const sendChat = (event) => {
    event.preventDefault();
    setShowEmojiPicker(false);
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

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

  return (
    <div className='wrapper'>
      <div className='container'>
        <div className='discussions'>
          <div className='discussion search'>
            <div className='searchbar'>
              <i className='fa fa-search' aria-hidden='true'></i>
              <input type='text' placeholder='Search...'></input>
            </div>
          </div>
          {contacts?.map((contact, key) => {
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
                  <p className='message'>
                    Let's meet for a coffee or something today ?
                  </p>
                </div>
                <div className='timer'>3 min</div>
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
            {/* <div className='message'>
              <div
                className='photo'
                style={{
                  backgroundImage: ` url(${activeContact?.avatarImage})`,
                }}
              >
                <div className='online'></div>
              </div>
              <p className='text'> Hi, how are you ? </p>
            </div>
            <div className='message text-only'>
              <p className='text'>
                {' '}
                What are you doing tonight ? Want to go take a drink ?
              </p>
            </div> */}
            {/* <p className='time'> 14h58</p> */}
            {allMessages?.map((message, index) => {
              if (message?.fromSelf) {
                return (
                  <div className='message text-only'>
                    <div className='response'>
                      <p className='text'> {message?.message}</p>
                    </div>
                  </div>
                );
              } else if (
                allMessages?.[index - 1]?.fromSelf === false &&
                message?.fromSelf === false
              ) {
                return (
                  <div className='message text-only'>
                    <p className='text'> {message?.message}</p>
                  </div>
                );
              } else {
                return (
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
                );
              }
            })}
            {/* <div className='message text-only'>
              <div className='response'>
                <p className='text'> Hey Megan ! It's been a while 😃</p>
              </div>
            </div>
            <div className='message text-only'>
              <div className='response'>
                <p className='text'> When can we meet ?</p>
              </div>
            </div>
            <p className='response-time time'> 15h04</p>
            <div className='message'>
              <div
                className='photo'
                style={{
                  backgroundImage: ` url(${activeContact?.avatarImage})`,
                }}
              >
                <div className='online'></div>
              </div>
              <p className='text'> 9 pm at the bar if possible 😳</p>
            </div>
            <p className='time'> 15h09</p> */}
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

export default Contacts;
