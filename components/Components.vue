<template>
  <div>
    <h2>Components</h2>
    <section>
      <h3>PriceButton</h3>
      <div>
        <PriceButton />
        <PriceButton price="1.23"/>
        <PriceButton price="12.34" adornment="lowest" />
        <PriceButton price="98.76" adornment="highest" />
        <PriceButton checked />
        <PriceButton price="1.23" checked />
        <PriceButton price="12.34" adornment="lowest" checked />
        <PriceButton price="98.76" adornment="highest" checked />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Components"
}
</script>
