import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faCheck, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCheck)
library.add(faThumbsUp)
library.add(faThumbsDown)

Vue.component('font-awesome-icon', FontAwesomeIcon)
