<template>
  <QuoteAnalyzer :rows="dataSample" />
</template>

<script>
import dataSample from '../data/datasample.json'

export default {
  name: "QuoteAnalyzerPage",
  data() {
    return {
      dataSample
    }
  }
}
</script>
