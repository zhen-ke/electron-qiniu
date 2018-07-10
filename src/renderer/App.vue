<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "qiniu"
};
</script>

<style>
/* CSS */
html,
body,
#app {
  height: 100%;
}
*::-webkit-scrollbar {
  display: none;
}
html {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

body,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
textarea,
p,
blockquote,
th,
td,
hr,
button,
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

audio,
canvas,
video {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

a div,
a p,
a h1,
a h2,
a h3,
a h4,
a h5,
a h6 {
  *cursor: pointer;
}

body,
button,
input,
select,
textarea {
  font: 12px/1.5 tahoma, arial, sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 1em;
}

a {
  text-decoration: none;
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  a:active {
    background-color: transparent;
  }
}

a:active {
  outline: 0 none;
}

small,
cite,
code,
em,
th,
i,
b {
  font-size: 1em;
  font-style: normal;
  font-weight: 500;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

input,
select,
textarea,
button {
  font-size: 1em;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: border-box;
}

button,
input[type="button"],
input[type="submit"] {
  cursor: pointer;
}

button[disabled],
input[disabled] {
  cursor: default;
}

button::-moz-focus-inner,
input::-moz-focus-inner {
  border: 0 none;
  padding: 0;
}

textarea {
  overflow: auto;
  vertical-align: top;
}

input[type="text"]:focus,
input[type="password"]:focus,
textarea:focus {
  outline: 0 none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

fieldset,
img,
iframe {
  border: 0 none;
}

img {
  display: inline-block;
  vertical-align: bottom;
  -ms-interpolation-mode: bicubic;
}

iframe {
  display: block;
}

ul,
ol {
  list-style: none;
}

li {
  vertical-align: top;
}

q:before,
q:after {
  content: "";
}

html,
body {
  min-height: 100%;
  background: #fff;
}

body {
  font-family: "PingFangSc Regular", "Microsoft Yahei", "Helvetica Neue",
    Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;
}
</style>