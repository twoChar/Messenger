import { sortChats } from './chatHelpers';
import { apiLink } from '../apiLink';

// Fetch contacts (Layout component)
export const getContacts = async (user, setContacts, setContactError, setContactLoading) => {
  try {
    const response = await fetch(apiLink + '/api/users', {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw { message: response.statusText, status: response.status };
      }
      const error = await response.json();
      throw { message: error.message || response.statusText, status: response.status };
    }
    const contactData = await response.json();
    setContacts(contactData);
    setContactError(null);
  } catch (err) {
    setContacts([]);
    setContactError(err);
  } finally {
    setContactLoading(false);
  }
};

// Fetch chats (Layout component)
export const getChats = async (user, setChats, setChatError, setChatLoading) => {
  try {
    const response = await fetch(apiLink + '/api/users/' + user._id + '/conversations', {
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw { message: response.statusText, status: response.status };
      }
      const error = await response.json();
      throw { message: error.message || response.statusText, status: response.status };
    }
    const chatData = await response.json();
    const sortedChats = sortChats(chatData);
    setChats(sortedChats);
    setChatError(null);
  } catch (err) {
    setChats([]);
    setChatError(err);
    console.log(err);
  } finally {
    setChatLoading(false);
  }
};

// Fetch messages (Chat component)
export const getMessages = async (
  user,
  chatId,
  setMessages,
  setMessageError,
  setMessageLoading,
) => {
  try {
    const response = await fetch(apiLink + '/api/conversations/' + chatId + '/messages', {
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw { message: response.statusText, status: response.status };
      }
      const error = await response.json();
      throw { message: error.message || response.statusText, status: response.status };
    }
    const messageData = await response.json();
    setMessages(messageData);
    setMessageError(null);
  } catch (err) {
    setMessages([]);
    setMessageError(err);
    console.log(err);
  } finally {
    setMessageLoading(false);
  }
};

// Remove a user id from exclusions list on chat (ChatPopup and ContactPage components)
export const removeExclusion = async (
  setChats,
  updatedChats,
  chat,
  user,
  navigate,
  setShowChatPopup,
) => {
  try {
    const response = await fetch(
      apiLink + '/api/conversations/' + chat._id + '/include/' + user._id,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      },
    );
    if (response.status === 200) {
      setChats(updatedChats);
      navigate('/chats/' + chat._id);
      if (setShowChatPopup) {
        setShowChatPopup(false);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// Upload an image sent in chat to database (Chat component)
export const uploadImage = async (
  user,
  formData,
  emitMessage,
  setText,
  setImage,
  setImageError,
) => {
  try {
    const response = await fetch(apiLink + '/api/messages/send-img', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
      body: formData,
    });
    const responseData = await response.json();
    if (response.status === 200) {
      emitMessage(responseData.image);
      setText('');
      setImage('');
      setImageError('');
    }
  } catch (err) {
    console.log(err);
  }
};

// Update last read time (ChatPage component)
export const updateLastRead = async (user, thisUser, chat, updateLocalUser) => {
  try {
    const response = await fetch(apiLink + '/api/users/' + user._id + '/timestamp/' + chat._id, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
      }),
    });
    if (response.status === 200) {
      updateLocalUser(chat, thisUser);
    }
  } catch (err) {
    console.log(err);
  }
};
