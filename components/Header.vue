<template>
  <header class="flex flex-row justify-center w-screen bg-gray-100 px-8 py-4">
    <div class="flex flex-row justify-between w-full max-w-screen-2xl">
      <h1 class="text-xl font-bold">Joe Maffei</h1>
      <div class="space-x-4">
        <NuxtLink to="/">Quote Analyzer</NuxtLink>
        <NuxtLink to="/components">Components</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header"
}
</script>
