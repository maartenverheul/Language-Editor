# Language Editor

![screenshot 1](/screenshots/1.png)

---

[Use the online editor](https://maartenverheul.github.io/Language-Editor/)

---

Edit language files in JSON format. The files are expected to be in the following format:

```JSON
{
  "language_identifier": {
    "category_name": {
      "key": "value"
      ... more keys
    }
    ... more categories
  }
  ... more languages
}
```

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
