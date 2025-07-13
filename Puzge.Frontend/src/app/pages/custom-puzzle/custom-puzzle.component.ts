import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language.model';

@Component({
  selector: 'app-custom-puzzle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './custom-puzzle.component.html',
  styleUrls: ['./custom-puzzle.component.scss']
})
export class CustomPuzzleComponent implements OnInit {
  currentLanguage: Language = 'en';

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }
} 