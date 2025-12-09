import { Component, OnInit, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink, Router } from '@angular/router';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { RequestDataService } from '../reuseables/http-loader/request-data.service';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";

import { trigger, style, transition, animate } from '@angular/animations';
import { tap, delay } from 'rxjs/operators';

interface Channel {
  id: number;
  invest: number;
  daily: number;
  cycleDays: number;
  total: number;
  title?: string;
}

@Component({
  standalone: true,
  imports: [
    RouterLink,
    CommonModule, MatSliderModule,MatIconModule,
     SpinnerComponent,FormsModule,
     MenuBottomComponent
   ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', './style1.component.css'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})

export class MainComponent implements OnInit {

  quickNav = inject(QuickNavService)
  reqServerData = inject(RequestDataService)

  router = inject(Router)

  channels: Channel[] = [
    { id: 1, invest: 5000,  daily: 1000,  cycleDays: 7,  total: 7000,  title: 'Channel 1' },
    { id: 2, invest: 6000,  daily: 2000,  cycleDays: 5,  total: 10000, title: 'Channel 2' },
    { id: 3, invest: 12000, daily: 2800,  cycleDays: 6,  total: 16800, title: 'Channel 3' },
    { id: 4, invest: 30000, daily: 4000,  cycleDays: 10, total: 40000, title: 'Channel 4' },
    { id: 5, invest: 60000, daily: 7000,  cycleDays: 10, total: 70000, title: 'Channel 5' },
    { id: 6, invest: 100000,daily: 20000, cycleDays: 6,  total: 120000, title: 'Channel 6' },
    { id: 7, invest: 300000,daily: 40000, cycleDays: 10, total: 400000, title: 'Channel 7' },
    { id: 8, invest: 600000,daily: 100000,cycleDays: 9,  total: 900000, title: 'Channel 8' }
  ];

  selectedChannel: any = null;
  modalOpen = false;
  GiftBoxOpen = false
  giftCode:any

  openBlank(url:any){
    window.open(url, '_blank')
  }

  ngOnInit(): void{
    (window as any).lucide?.createIcons();

    if (!Object.keys(this.quickNav.storeData.store).includes('user')||!this.quickNav.storeData.store['activities']) {
      this.reqServerData.get('main/')
      .subscribe(response => {
        // console.log("serviceData>>", this.quickNav.storeData.store);
      }

    );
    }
    this.startAutoSlide();
  }

  tiers = [
    { id:1, daily: '5%', lifecycle: 180, min: 10, max: 50, popular: false },
    { id:2, daily: '5.5%', lifecycle: 180, min: 50, max: 150, popular: true },
    { id:3,  daily: '6%', lifecycle: 180, min: 150, max: 300, popular: false }
  ];


  modalVisible = false;
  selectedTier: any = null;
  amount: number = 0;
  estimatedProfit: number = 0;

  openModal(tier: any){
    this.selectedTier = tier;
    this.amount = tier.min;
    this.updateEstimate();
    this.modalVisible = true;
  }

  closeModal(){
    this.modalVisible = false;
  }

  isInRange(value: number, min: number, max: number): boolean {
      console.log({value, min, max});
      return value >= min && value <= max;
  }

  updateEstimate(){
    if(!this.selectedTier || !this.amount){ this.estimatedProfit = 0; return; }
    const pct = parseFloat(this.selectedTier.daily.replace('%','')) / 100;
    const total =  0 + (this.amount * pct * this.selectedTier.lifecycle);
    // const total = this.amount + (this.amount * pct * this.selectedTier.lifecycle);
    this.estimatedProfit = Math.round(total * 100) / 100;

  }

  // helper to format naira symbol + number in template if you prefer
  fx(amount: number) {
    return `₦${amount.toLocaleString()}`;
  }

  // close on Escape
  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: KeyboardEvent) {
    if (this.modalVisible) this.closeModal();
  }

  investNow(){

    if (!this.isInRange(this.amount,this.selectedTier.min, this.selectedTier.max)) {
      this.quickNav.alert("Purchase plan out of price range!",'error')
      return
    }
    this.reqServerData.post('main/', {processor:"create",data:this.selectedTier, amount:this.amount}).subscribe((res)=>{
      if (res.redirect) {
        this.quickNav.go("/"+res.redirect)
      }

    })

  }

  loadGiftCode(){
    if (!this.giftCode) {
      this.quickNav.alert("Gift code required",'error')
      return
    }

    console.log('loading Gift>>', this.giftCode);
    this.reqServerData.post('main/', {processor:"redeem", 'code':this.giftCode}).subscribe((res)=>{

      console.log({res});


    })

  }

  // slider handler
  images = [
    'assets/home-slide/slide01.jpeg',
    'assets/home-slide/slide02.jpeg',
    'assets/home-slide/slide03.jpeg',
  ];

  currentIndex = 0;
  autoSlideInterval: any;

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 3000); // Change every 3 seconds
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  notificationsCount = 0; // Example count

  current = 'home';

}
