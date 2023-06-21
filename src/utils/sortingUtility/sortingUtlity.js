export const sortedContactsAccToTime = (
  allLastMsgs,
  currentUser,
  contacts,
  setSortedContacts
) => {
  let reqArray = [];
  for (let i = 0; i < allLastMsgs?.length; i++) {
    if (allLastMsgs?.[i]?.id !== currentUser?._id) {
      reqArray.push(
        contacts?.find((item) => item?._id === allLastMsgs?.[i]?.id)
      );
    }
  }
  for (let i = 0; i < contacts?.length; i++) {
    if (allLastMsgs?.find((item) => item?.id !== contacts?.[i]?._id)) {
      reqArray.push(contacts[i]);
    }
  }
  reqArray = new Set(reqArray);
  reqArray = Array.from(reqArray);
  if (reqArray?.length === 0) {
    setSortedContacts(contacts);
  } else {
    setSortedContacts(reqArray);
  }
};
