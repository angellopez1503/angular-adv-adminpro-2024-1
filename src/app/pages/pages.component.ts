import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunctions(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit, AfterViewInit {
  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      customInitFunctions();
    }, 50);
  }

  ngOnInit(): void {
    this.sidebarService.cargarMenu()
    // setTimeout(() => {
    //   customInitFunctions();
    // }, 50);
  }
}
