/*
 *  Copyright (c) 2020 Maverick Labs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as,
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import backend from "i18next-xhr-backend";
// import translationEN from "./locales/en/translation";
// import translationMR from "./locales/mr/translation";
// // import './../../public'

// // the translations
// const resources = {
//   en: {
//     translation: translationEN
//   },
//   mr: {
//     translation: translationMR
//   }
// };

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .use(backend)
  .init({
    // resources,
    lng: localStorage.getItem("SELECTED_LANGUAGE") || "en_IN",

    // keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    },

    react: {
      wait: true,
      nsMode: "default"
    },

    backend: {
      //      loadPath: "http://192.168.0.123:9000/static/locale_{{lng}}.json"
      loadPath: "/locales/locale_{{lng}}.json"
    }
  });

export default i18n;
