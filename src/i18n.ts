import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(detector)
    .use(initReactI18next)
    .init({
        lng: 'ua',
        supportedLngs: ["ua", "en"],
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        ns: ["common"],
        defaultNS: "common",
        fallbackLng: ["ua", "en"],
    });

export default i18n;

