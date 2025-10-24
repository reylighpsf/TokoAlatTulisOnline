<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>TokoAkbar</title>

  @viteReactRefresh
  @vite(['resources/js/main.tsx', 'resources/css/shadcn.css'])
</head>
<body>
  <div id="app"></div>
</body>
</html>
