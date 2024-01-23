<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1>{{ msg }}</h1>
    <h3>Here are your shortcuts:</h3>
    <div v-for="shortcut in shortcuts">
      <p>{{ shortcut.application_name }} - {{ shortcut.command }} - {{ shortcut.mac }}</p>
    </div>
  </div>


</template>

<script>
import axios from 'axios'

export default {
  name: 'YourComponentName',
  data() {
    return {
      shortcuts: []
      };
  },
  methods: {
    async getShortcuts() {
      var resp = await axios.get('/api/shortcut');
      this.shortcuts = resp.data;
      console.log(shortcuts);
    }
  },
  beforeMount() {
     this.getShortcuts()
  },
};
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
