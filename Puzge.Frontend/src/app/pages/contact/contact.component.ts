import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  currentLanguage: Language = 'en';
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isSubmitting = false;
  submitSuccess = false;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 2000);
  }
} 