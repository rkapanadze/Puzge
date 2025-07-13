// src/app/services/language.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language, LanguageOption } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private readonly LANGUAGE_KEY = 'kvandzi_language';

  public readonly availableLanguages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ka', name: 'ქართული', flag: '🇬🇪' }
  ];

  constructor() {
    this.loadLanguageFromStorage();
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  toggleLanguage(): void {
    const current = this.getCurrentLanguage();
    const newLanguage = current === 'en' ? 'ka' : 'en';
    this.setLanguage(newLanguage);
  }

  private loadLanguageFromStorage(): void {
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) as Language;
    if (savedLanguage && this.availableLanguages.some(lang => lang.code === savedLanguage)) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  // Helper method to get localized text
  getLocalizedText(text: { en: string; ka: string }): string {
    const currentLang = this.getCurrentLanguage();
    return text[currentLang] || text.en;
  }

  // Helper method to get font family based on language
  getFontFamily(): string {
    const currentLang = this.getCurrentLanguage();
    if (currentLang === 'ka') {
      // Georgian - use elegant serif fonts associated with wine regions
      return "'Playfair Display', 'Crimson Text', 'Libre Baskerville', serif";
    } else {
      // English - use friendly, curvy fonts
      return "'Nunito', 'Comic Sans MS', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    }
  }
}
