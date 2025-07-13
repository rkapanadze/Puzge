
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language.model';
import { ProductType } from '../../enums/product-type.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentLanguage: Language = 'en';

  constructor(
    public languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  navigateToProducts(type: ProductType): void {
    this.router.navigate(['/products'], { queryParams: { type: type } });
  }

  getFeaturedCategories() {
    return [
      {
        id: 'puzzles',
        name: {
          en: 'Puzzles',
          ka: 'თავსატეხები'
        },
        description: {
          en: 'Challenge your mind with our collection of puzzles',
          ka: 'გამოიწვიეთ თქვენი გონება ჩვენი თავსატეხების კოლექციით'
        },
        image: '/assets/images/puzzles-category.svg',
        slug: 'puzzles',
        type: ProductType.PUZZLE,
        icon: '🧩'
      },
      {
        id: 'board-games',
        name: {
          en: 'Board Games',
          ka: 'სამაგიდო თამაშები'
        },
        description: {
          en: 'Bring family and friends together with classic board games',
          ka: 'შეკრიბეთ ოჯახი და მეგობრები კლასიკური სამაგიდო თამაშებით'
        },
        image: '/assets/images/board-games-category.svg',
        slug: 'board-games',
        type: ProductType.BOARDGAME,
        icon: '🧠'
      },
      {
        id: 'card-games',
        name: {
          en: 'Card Games',
          ka: 'ბარათული თამაშები'
        },
        description: {
          en: 'Discover exciting card games for all ages',
          ka: 'აღმოაჩინეთ საინტერესო ბარათული თამაშები ყველა ასაკისთვის'
        },
        image: '/assets/images/card-games-category.svg',
        slug: 'card-games',
        type: ProductType.CARDGAME,
        icon: '🃏'
      }
    ];
  }
}
