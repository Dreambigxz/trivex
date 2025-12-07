import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Header2Component } from '../components/header2/header2.component';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { CountdownPipe } from '../reuseables/pipes/countdown.pipe';
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';


@Component({
  selector: 'app-user-package',
  imports: [
    CommonModule,
    Header2Component,
    SpinnerComponent,
    CountdownPipe,
    MenuBottomComponent,
    CurrencyConverterPipe
  ],
  templateUrl: './user-package.component.html',
  styleUrl: './user-package.component.css'
})
export class UserPackageComponent {

  quickNav = inject(QuickNavService)

  activeTab: 'active' | 'completed' = 'active';
  expandedId: number | null = null;

  investments: any  //= [ ]

  ngOnInit(){

    if (!this.quickNav.storeData.get('packages')) {
      this.quickNav.reqServerData.get('my-investment/').subscribe((res)=>{
        console.log(this.quickNav.storeData.get('packages'));
        this.investments=this.quickNav.storeData.get('packages')
      })
    }else{
      this.investments=this.quickNav.storeData.get('packages')
    }

    // console.log('INVETMENTS');

  }


  // OLD

  get activeList() {
    const activePackage =  this.investments?.filter((i:any) => i.status === 'active');
    if (activePackage&&!this.expandedId&&activePackage[0]) {
      this.expandedId=activePackage[0].id
    }

    return activePackage
  }

  get completedList() {
    // return this.investments?.filter((i:any) => i.status === 'completed');
    const data =  this.investments?.filter((i:any) => i.status === 'completed');
    return data
  }

  get totalActiveAmount() {
    return this.activeList?.reduce((sum:any, i:any) => sum + this.calcTotalExpected(i), 0);
  }

  get totalCompletedAmount() {
    return this.completedList?.reduce((sum:any, i:any) => sum + i.data.total, 0);
  }

  toggleExpand(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  calcDailyEarning(robot:any){
    const pct = parseFloat(robot.data.daily.replace('%', '')) / 100;
    return Math.round((robot.data.invest * pct) * 100) / 100;

  }

  calcTotalExpected(robot: any) {
    const pct = parseFloat(robot.data.daily.replace('%', '')) / 100;
    return this.calcDailyEarning(robot) * robot.data.lifecycle
    // Math.round((robot.data.invest * pct * robot.data.lifecycle) * 100) / 100;
  }

  calcTotalEarned(robot: any) {
    const pct = parseFloat(robot.data.daily.replace('%', '')) / 100;
    const start = new Date(robot.created_at);
    const today = new Date();
    const diffDays = Math.min(Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)), robot.data.lifecycle);
    return Math.round(robot.data.invest * pct * diffDays * 100) / 100;
  }

  calcLeftToEarn(robot: any) {
     return this.calcTotalExpected(robot) - this.calcTotalEarned(robot);
  }

  calcDaysLeft(robot: any) {
    const end = new Date(robot.ending_at);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff < 0 ? 0 : diff;
  }

}
