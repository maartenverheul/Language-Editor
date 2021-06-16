<template>
<div>
  <Header/>
  <b-container>
    <Nuxt />
    <span id="author">By <a target="_blank" href="https://www.maartenverheul.nl">Maarten Verheul</a></span>
  </b-container>
</div>
</template>

<style scoped>
#author {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 2px 4px;
  font-size: 0.7em;
}
</style>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  overflow-y: scroll;
}

.btn-link:focus {
  outline: none;
  box-shadow: none;
}
</style>
