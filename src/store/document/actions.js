import { api } from "boot/axios";

export function addPage({ commit }) {
  commit("addPage");
}

export function addAddition({ commit }, { addition, layout }) {
  commit("addAddition", { addition, layout });
}

export function moveAddition({ commit }, { x, y, w, h, additionId, pageId }) {
  commit("moveAddition", { x, y, w, h, additionId, pageId });
}

export function setAdditionContent({ commit }, { additionId, content }) {
  commit("setAdditionContent", { additionId, content });
}

export async function requestDocument({ commit }, { documentId }) {
  return api
    .get(`/document/view/${documentId}`)
    .then((res) => res.data)
    .then(({ pages, additions, pageIndex, additionIndex, layout }) => {
      commit("setDocument", {
        pages,
        additions,
        pageIndex,
        additionIndex,
        layout,
      });
    });
}

export async function saveDocument({ commit }, { documentId, document }) {
  return api.put(`/document/update/${documentId}`, { ...document });
}

export function updatePageName({ commit }, { pageId, name }) {
  commit("updatePageName", { pageId, name });
}

export function addChanges({ commit }, { changes }) {
  commit("addChanges", { changes });
}

export function undoChanges({ commit }) {
  commit("undoChanges");
}

export function redoChanges({ commit }) {
  commit("redoChanges");
}

export function deleteAddition({ commit }, { additionId }) {
  commit("deleteAddition", { additionId });
}
