export function addPage(state) {
  state.pages.push({
    name: ``,
    id: state.pageIndex,
  });
  state.pageIndex++;
}

export function addAddition(state, { addition, layout }) {
  state.additions.push({
    ...addition,
    id: state.additionIndex,
    content: null,
  });
  state.layout.push(layout);
  state.additionIndex++;
}

export function moveAddition(state, { x, y, w, h, additionId, pageId }) {
  const addition = state.layout.find((addition) => addition.id == additionId);
  addition.x = x;
  addition.y = y;
  addition.w = w;
  addition.h = h;
  addition.pageId = pageId;
}

export function setAdditionContent(state, { additionId, content }) {
  const addition = state.additions.find(
    (addition) => addition.id == additionId
  );
  addition.content = content;
}

export function setDocument(
  state,
  { pages, additions, pageIndex, additionIndex, layout }
) {
  state.pages = pages;
  state.additions = additions;
  state.pageIndex = pageIndex;
  state.additionIndex = additionIndex;
  state.layout = layout;
}

export function updatePageName(state, { pageId, name }) {
  const pageIndex = state.pages.findIndex((page) => page.id == pageId);
  state.pages[pageIndex].name = name;
}

export function addChanges(state, { changes }) {
  state.history.push(changes);
  state.changes++;
  state.currentChangeIndex = state.changes;
}

export function undoChanges(state) {
  if (state.currentChangeIndex >= 1) state.currentChangeIndex--;
}

export function redoChanges(state) {
  if (state.currentChangeIndex < state.changes) state.currentChangeIndex++;
}

export function deleteAddition(state, { additionId }) {
  state.layout = state.layout.filter((addition) => addition.id != additionId);
  state.additions = state.additions.filter(
    (addition) => addition.id != additionId
  );
}
