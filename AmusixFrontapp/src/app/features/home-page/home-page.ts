import { Component, signal } from '@angular/core';
import packageFile from '../../../../package.json';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {
  appVersion = signal(packageFile.version);
}
