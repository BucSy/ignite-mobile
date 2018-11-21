import I18n from 'react-native-i18n';
import en from './en';
import hu from './hu';

I18n.fallbacks = true;

I18n.translations = {
  en,
  hu
}

export default I18n;