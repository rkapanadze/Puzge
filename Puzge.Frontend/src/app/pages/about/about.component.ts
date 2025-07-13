import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  currentLanguage: Language = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }
} 