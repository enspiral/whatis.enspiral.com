<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta property="og:title" content="{{ title }}" />
    <meta property="og:site_name" content="{{ site_name }}" />
    <meta property="og:url" content="{{ url }}" />
    <meta property="og:description" content="{{ description }}" />
    <meta property="og:image" content="{{ url }}/{{ image }}" />
    <meta property="og:type" content="{{ type }}" />
    <meta property="article:publisher" content="{{ publisher }}" />
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
