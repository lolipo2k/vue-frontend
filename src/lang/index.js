import messages from "./text.js"
import { createI18n } from "vue-i18n";

const i18n = createI18n({
    locale: 'cn', 
    fallbackLocale: 'en', 
    messages, 
})

export default i18n