<template>
  <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
    <dt>{{ label }}</dt>
    <dd class="text-2xl">
      {{ value }}
    </dd>
  </div>
</template>

<script>
export default {
  name: "TopPanel",
  props: {
    label: String,
    value: String,
  }
}
</script>
