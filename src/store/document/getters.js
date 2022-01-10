// export const getAdditionsListByPage = (state) => (page) => {
//   return state.lists.find((list) => list.page == page).additions;
// };

export const getAdditionById = (state) => (additionId) => {
  return state.additions.find((addition) => addition.id == additionId);
};

export const getPageLayout = (state) => (pageId) => {
  return state.layout.filter((item) => item.pageId == pageId);
};
