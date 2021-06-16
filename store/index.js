export const state = () => ({
  language: 0
})

export const mutations = {
  setLanguage(state, data) {
    state.language = data;
  }
}

