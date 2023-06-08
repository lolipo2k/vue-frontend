import messages from "./text.js"
import { createI18n } from "vue-i18n";

const i18n = createI18n({
    locale: 'en', 
    fallbackLocale: 'cn', 
    messages, 
})

export default i18n