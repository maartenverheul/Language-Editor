<template>
  <b-row v-if="!rerender">
    <b-col>
      <b-row class="pt-3" v-if="fields">
        <b-col>
          <div>
            <b-button id="copyJSONbutton" variant="primary" size="sm" type="button" @click="copyJSON">Copy JSON to clipboard</b-button>
            <b-tooltip ref="copytooltip" target="copyJSONbutton" triggers="manual">
              Copied!
            </b-tooltip>
            <b-button variant="success" size="sm" type="button" @click="exportJSON">Export JSON</b-button>
            <b-button variant="danger"  size="sm" type="button" @click="closeFile">Close file</b-button>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-3 pb-5">
        <b-col v-if="fields">
          <b-tabs content-class="mt-3" v-model="selectedLanguageIndex">
            <b-tab
              :title="lang"
              v-for="lang in Object.keys(fields)"
              :key="lang"
            ></b-tab>
            <b-tab title="+" @click="addLanguage">
              <b-button variant="primary" size="lg mx-auto d-block mt-5" @click="addLanguage">Add language</b-button>
            </b-tab>
          </b-tabs>
          <b-row v-show="selectedLanguageName()">
            <b-col>
              <b-button-group>
                <b-button size="sm" type="button" class="text-danger" variant="link" @click="deleteLanguage">Delete language</b-button>
              </b-button-group>
              <h1 class="languageNameTag">{{selectedLanguageName()}}</h1>
              <b-row
                v-for="(category, categoryName) in fields[selectedLanguageName()]"
                :key="categoryName"
                class="mb-3"
              >
                <b-col>
                  <h3>
                    {{ categoryName }}
                    <b-button variant="link" class="text-danger" type="button" tabindex="-1" size="sm" @click="deleteCategory(categoryName)" title="Delete category">✕</b-button>
                  </h3>
                  <b-row
                    v-for="(item, key) in category"
                    :key="key"
                    class="mb-1 pl-4"
                  >
                    <b-col>
                      • <label>{{ key }}</label>
                    </b-col>
                    <b-col>
                      <b-form-input
                        size="sm"
                        class="langInput"
                        placeholder="empty"
                        v-model="
                          fields[selectedLanguageName()][categoryName][key]
                        "
                      ></b-form-input>
                    </b-col>
                    <b-col cols="1">
                      <b-button variant="link" class="text-danger" type="button" tabindex="-1" size="sm" @click="deleteKey(categoryName, key)" title="Delete key">✕</b-button>
                    </b-col>
                  </b-row>
                  <b-row class="pl-4" v-if="Object.keys(category).length == 0">
                    <b-col>
                      <label>Empty category</label>
                    </b-col>
                  </b-row>
                  <b-row class="pl-4">
                    <b-col cols="1">
                      <b-button variant="outline-primary" type="button" size="sm" block @click="addKey(categoryName)" title="Add key">+</b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="3">
                  <b-button variant="outline-primary" block type="button" @click="addCategory" title="Add category">+</b-button>
                </b-col>
              </b-row>
              <b-row>
                <textarea v-if="showCopyText" style="opacity: 0" id="json_selection_area" :value="JSON.stringify(fields, null, 2)" rows="3" ></textarea>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col v-else>
          <p>{{ fields }}</p>
          <div class="py-5 text-center">
            <b-button class="mb-5" type="button" variant="success" @click="createFile">Create a new file</b-button>
            <p>Or edit an existing language file:</p>
            <input v-if="!fields" type="file" accept=".json" @change="loadTextFromFile">
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "IndexPage",
  data: () => ({
    rerender: false,
    showCopyText: false,
    fields: null,
    selectedLanguageIndex: 0,
    filename: "",
    newLanguage: { name: "" }
  }),
  watch: {
    languageFile() {
      this.fields = JSON.parse(JSON.stringify(this.languageFile));
    },
    fields(){
      // Confirm window closing if file is open
      if(this.fields) window.onbeforeunload = function (e) {
          e = e || window.event;
          // For IE and Firefox prior to version 4
          if (e) {
              e.returnValue = 'Sure?';
          }
          // For Safari
          return 'Sure?';
      }
      else window.onbeforeunload = null;
    }
  },
  computed: {
    languageFile() {
      return this.$store.state.language;
    },
    newLanguageAllowed(){
      return !Object.keys(this.fields).includes(this.newLanguage.name);
    }
  },
  methods: {
    createFile(){
      this.fields = {}
    },
    selectedLanguageName() {
      return Object.keys(this.fields)[this.selectedLanguageIndex]||"";
    },
    loadTextFromFile(e){
      const file = e.target.files[0];
      this.filename = file.name;
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result)
          this.$store.commit('setLanguage', data);
        }catch(e){
          alert("The file contains invalid JSON.");
        }
      }
      reader.readAsText(file);
    },
    addLanguage(){
      let name = "";
      while(true){
        name = prompt("New language identifier");
        if(!Object.keys(this.fields).includes(name)) break;
      }
      if(!name) return false;

      let list = {};
      if(Object.keys(this.fields).length > 0){
        const lang = this.fields[Object.keys(this.fields)[0]];
        Object.keys(lang).forEach(categoryName => {
          const category = lang[categoryName];
          list[categoryName] = {}
          Object.keys(category).forEach(key => {
            list[categoryName][key] = ""
          });
        })
      }
      this.fields[name] = list;
      this.selectedLanguageIndex = Object.keys(this.fields).length - 1;
      this.rerenderPage();
    },
    addCategory(){
      let name = "";
      while(true){
        name = prompt("New category name");
        if(!Object.keys(this.fields[this.selectedLanguageName()]).includes(name)) break;
      }
      if(!name) return false;
      // Add category to each language
      Object.keys(this.fields).forEach(langName => this.fields[langName][name] = {});
      this.rerenderPage();
    },
    addKey(categoryName){
      let name = "";
      while(true){
        name = prompt("New key name");
        if(!Object.keys(this.fields[this.selectedLanguageName()][categoryName]).includes(name)) break;
      }
      if(!name) return false;
      // Add key to each language
      Object.keys(this.fields).forEach(langName => this.fields[langName][categoryName][name] = "");
      this.rerenderPage();
    },
    deleteKey(categoryName, keyName){
      const result = confirm(`Are you sure you want to delete key "${keyName}"?`);
      if(!result) return false;
      Object.keys(this.fields).forEach(langName => delete this.fields[langName][categoryName][keyName]);
      this.rerenderPage();
    },
    deleteCategory(categoryName){
      const result = confirm(`Are you sure you want to delete category "${categoryName}"?`);
      if(!result) return false;
      Object.keys(this.fields).forEach(langName => delete this.fields[langName][categoryName]);
      this.rerenderPage();
    },
    deleteLanguage(){
      const result = confirm(`Are you sure you want to delete language "${this.selectedLanguageName()}"?`);
      if(!result) return false;
      delete this.fields[this.selectedLanguageName()];
      this.selectedLanguageIndex = Math.max(this.selectedLanguageIndex - 1, 0);
      this.rerenderPage();
    },
    rerenderPage(){
      this.rerender = true;
      this.$nextTick(() => this.rerender = false);
    },
    addItem(categoryName, name){
      Object.keys(this.fields).forEach(lang => {
        this.fields[lang][categoryName][name] = ""
      });
    },
    exportJSON(){
      const data = this.fields;
      const fileToSave = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
          name: this.filename
      });

      saveAs(fileToSave, this.filename);
    },
    copyJSON(){
      const data = this.fields;
      this.showCopyText = true;
      this.$nextTick(() => {
        const area = document.getElementById("json_selection_area");
        area.select();
        area.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand("copy");
        this.showCopyText = false;
        this.$refs.copytooltip.$emit('open');
        setTimeout(() => {
          this.$refs.copytooltip.$emit('close');
        }, 2000);
      });

    },
    closeFile(){
      const result = confirm(`Are you sure you want to close this file?\n\nChanges are not saved automatically, export the file to save.`);
      if(!result) return false;
      this.fields = null;
    }
  }
};
</script>

<style scoped>
.languageNameTag {
  background-color: #fff5b6;
  border: 1px solid #e8d768;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  width: max-content;
  padding: 5px 30px;
  border-radius: 30px;
}
.langInput::placeholder {
  background-color: #ffefee;
  padding: 20px 10px;
}
</style>
