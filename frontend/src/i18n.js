import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Flamegram',
      connect: 'Connect, chat, and collaborate instantly. Flamegram is your modern, secure, and beautiful messaging platform for friends, teams, and communities.',
      login: 'Login',
      register: 'Register',
      getStarted: 'Get Started',
      dontHaveAccount: "Don't have an account?",
      createOneHere: 'Create one here',
      alreadyHaveAccount: 'Already have an account?',
      signInHere: 'Sign in here',
      profile: 'Profile',
      accountCreated: 'Account created',
      chatRooms: 'Chat Rooms',
      newRoom: 'New Room',
      selectChatRoom: 'Select a chat room to start messaging',
      send: 'Send',
      // Add more keys as needed
    }
  },
  de: {
    translation: {
      welcome: 'Willkommen bei Flamegram',
      connect: 'Verbinden, chatten und sofort zusammenarbeiten. Flamegram ist Ihre moderne, sichere und schöne Messaging-Plattform für Freunde, Teams und Communities.',
      login: 'Anmelden',
      register: 'Registrieren',
      getStarted: 'Loslegen',
      dontHaveAccount: 'Sie haben noch kein Konto?',
      createOneHere: 'Hier erstellen',
      alreadyHaveAccount: 'Sie haben bereits ein Konto?',
      signInHere: 'Hier anmelden',
      profile: 'Profil',
      accountCreated: 'Konto erstellt',
      chatRooms: 'Chat-Räume',
      newRoom: 'Neuer Raum',
      selectChatRoom: 'Wählen Sie einen Chatraum, um mit dem Messaging zu beginnen',
      send: 'Senden',
    }
  },
  ru: {
    translation: {
      welcome: 'Добро пожаловать в Flamegram',
      connect: 'Общайтесь, чатитесь и сотрудничайте мгновенно. Flamegram — это современная, безопасная и красивая платформа для общения с друзьями, командами и сообществами.',
      login: 'Войти',
      register: 'Регистрация',
      getStarted: 'Начать',
      dontHaveAccount: 'Нет аккаунта?',
      createOneHere: 'Создать здесь',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      signInHere: 'Войти здесь',
      profile: 'Профиль',
      accountCreated: 'Аккаунт создан',
      chatRooms: 'Чат-комнаты',
      newRoom: 'Новая комната',
      selectChatRoom: 'Выберите чат-комнату, чтобы начать общение',
      send: 'Отправить',
    }
  },
  uz: {
    translation: {
      welcome: 'Flamegram ga xush kelibsiz',
      connect: 'Ulaning, suhbatlashing va bir zumda hamkorlik qiling. Flamegram — do\'stlar, jamoalar va hamjamiyatlar uchun zamonaviy, xavfsiz va chiroyli xabar almashish platformasi.',
      login: 'Kirish',
      register: 'Ro\'yxatdan o\'tish',
      getStarted: 'Boshlash',
      dontHaveAccount: 'Hisobingiz yo\'qmi?',
      createOneHere: 'Bu yerda yarating',
      alreadyHaveAccount: 'Allaqachon hisobingiz bormi?',
      signInHere: 'Bu yerda kiring',
      profile: 'Profil',
      accountCreated: 'Hisob yaratildi',
      chatRooms: 'Chat xonalari',
      newRoom: 'Yangi xona',
      selectChatRoom: 'Xabar almashishni boshlash uchun chat xonasini tanlang',
      send: 'Yuborish',
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.split('-')[0],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 