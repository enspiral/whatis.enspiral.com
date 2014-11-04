<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{{ title }}</title>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="./bundle.css" />
  </head>
  <body>
    <main>
      {% include "./slides.swig" %}
    </main>
    <script type="text/javascript" src="./bundle.js" defer="defer"></script>
  </body>
</html>
